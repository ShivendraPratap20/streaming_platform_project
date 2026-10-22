import { Request, Response } from 'express';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import { userSignupSchema, userLoginSchema, userUpdateSchema } from '../validators/user.validation.js';
import userModel from '../model/database/user.model.js';
import { AppError } from '../utils/AppError.js'
import sessionModel from '../model/database/session.model.js';
import { SAME_SITE, SECURE, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY, GOOGLE_REDIRECT_URL, GOOGLE_AUTH_URL, GOOGLE_TOKEN_URL, FRONTEND_URL } from '../constants/index.js';

const authSelf = async (req: Request, res: Response) => {
    const isAuthenticated:boolean | undefined = req.isAuthenticated;
    if(!isAuthenticated)
        return res.status(401).json({status: false, message: 'Not Authenticated'});

    res.status(200).json({ status: true, message: 'Authenticated', data: req.authenticatedUserData});
};

const registerUser = async (req: Request, res: Response) => {
    const reult = await userSignupSchema.safeParseAsync(req.body);
    if (!reult.success)
        throw new AppError('Invalid user data', 400, true, reult.error.flatten());

    const { userName, userID, email, password, phoneNumber, profilePicture, accountType, authorizationType } = reult.data;

    const existingUser = await userModel.findOne({ $or: [{ userID }, { email }] });
    if (existingUser) {
        throw new AppError('User with the same userID or email already exists', 409);
    }

    const newUser = new userModel({
        userName,
        userID,
        email,
        password,
        ...(phoneNumber && { phoneNumber }),
        ...(profilePicture && { profilePicture }),
        ...(accountType && { accountType }),
        ...(authorizationType && { authorizationType })
    });

    const tokenData = new sessionModel({ userID: newUser.userID });

    const { accessToken, refreshToken }: { accessToken: string, refreshToken: string } = await tokenData.generateTokens(newUser);
    if (accessToken && refreshToken) {

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: SECURE,
            sameSite: SAME_SITE,
            maxAge: ACCESS_TOKEN_EXPIRY.getTime() - Date.now(),
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: SECURE,
            sameSite: SAME_SITE,
            maxAge: REFRESH_TOKEN_EXPIRY.getTime() - Date.now(),
        });
    }

    const savedUser = await newUser.save();


    res.status(201).json({ status: true, message: 'Account created', data: savedUser });
};

const googleLoginHandler = async (req: Request, res: Response) => {

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URL || !process.env.GOOGLE_STATE) {
        throw new AppError('Google OAuth configuration is missing', 500);
    }

    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URL,
        response_type: 'code',
        scope: 'openid email profile',
        state: process.env.GOOGLE_STATE,
    });

    res.redirect(`${GOOGLE_AUTH_URL}?${params}`);

};

const googleCallbackHandler = async (req: Request, res: Response) => {
    const { code, state } = req.query;

    if (state != process.env.GOOGLE_STATE || !code)
        throw new AppError('Invalid state or code parameter', 400);

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URL) {
        throw new AppError('Google OAuth configuration is missing', 500);
    }

    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code: code.toString(),
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_REDIRECT_URL,
            grant_type: 'authorization_code',
        }),
    });

    if (!tokenResponse.ok) {
        throw new AppError('Failed to exchange code for tokens', 500);
    }

    const tokens = await tokenResponse.json();
    // tokens = { access_token, id_token, expires_in, scope, token_type, refresh_token? }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
        throw new AppError('Invalid ID token', 400);
    }

    const { sub, email, name, picture, email_verified }: TokenPayload = payload;

    if (!email_verified) {
        throw new AppError('Email not verified by google', 400);
    }

    let existingUser = await userModel.findOne({ $or: [{ userID: email }, { email }] });
    if (!existingUser) {
        const newUser = new userModel({
            userName: name,
            userID: email,
            email,
            profilePicture: picture || '',
            accountType: 'USER',
            authorizationType: 'GOOGLEAUTH'
        });
        existingUser = await newUser.save();
    }

    const tokenData = new sessionModel({
        userID: email
    });

    const { accessToken, refreshToken } = await tokenData.generateTokens(existingUser);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: SECURE,
        sameSite: SAME_SITE,
        maxAge: ACCESS_TOKEN_EXPIRY.getTime() - Date.now(),
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: SECURE,
        sameSite: SAME_SITE,
        maxAge: REFRESH_TOKEN_EXPIRY.getTime() - Date.now(),
    });
    res.status(201).json({ status: true, message: "Account Created", data: existingUser });
    res.redirect(FRONTEND_URL);
};

const userLogin = async (req: Request, res: Response) => {
    const result = await userLoginSchema.safeDecodeAsync(req.body);
    if (!result.success) {
        throw new AppError('Invalid login data', 400, true, result.error.flatten());
    }

    const { userID, password } = result.data;
    const userData = await userModel.findOne({ userID });
    if (!userData) {
        throw new AppError('Invalid userID or password', 400);
    }
    const isMatch = await bcrypt.compare(password, userData.password || '');
    if (!isMatch) {
        throw new AppError('Invalid userID or password', 400);
    }

    const tokenData = new sessionModel({ userID: userData._id });

    const { accessToken, refreshToken }: { accessToken: string, refreshToken: string } = await tokenData.generateTokens(userData);
    if (accessToken && refreshToken) {
        await tokenData.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: SECURE,
            sameSite: SAME_SITE,
            maxAge: ACCESS_TOKEN_EXPIRY.getTime() - Date.now(),
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: SECURE,
            sameSite: SAME_SITE,
            maxAge: REFRESH_TOKEN_EXPIRY.getTime() - Date.now(),
        });
    }

    res.status(200).json({ status: true, message: 'Login successful', data: userData });
};

const userModify = async (req: Request, res: Response) => {
    const userID = req.authenticatedUserData?.userID;
    let { updatingData } = req.body;

    updatingData = await userUpdateSchema.parseAsync({ updatingData });

    if (!updatingData || Object.keys(updatingData).length === 0)
        throw new AppError('No valid data provided for update', 400);

    if (!userID)
        throw new AppError('User ID is required for update', 400);

    const updateUserData = await userModel.findOneAndUpdate({ userID }, { $set: updatingData }, { new: true });

    if (!updateUserData)
        throw new AppError('Updation Failed', 404, true, { userID: 'User with the provided ID does not exist' });

    res.status(200).json({ status: true, message: 'User updated successfully', data: updateUserData });
};

const userDelete = async (req: Request, res: Response) => {
    const userID = req.authenticatedUserData?.userID;

    if (!userID)
        throw new AppError('User ID is required for deletion', 400);

    const deletedUser = await userModel.findOneAndDelete({ userID });

    if (!deletedUser)
        throw new AppError('Deletion Failed', 404, true, { details: 'User with the provided ID does not exist' });

    res.status(200).json({
        status: true,
        message: 'User deleted successfully',
        data: { userID: deletedUser.userID },
    });
};

const userLogout = async (req: Request, res: Response) => {
    const userID = req.authenticatedUserData?.userID;

    if (!userID)
        throw new AppError('User ID is required for logout', 400);

    await sessionModel.deleteMany({ userID });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
        status: true,
        message: 'User logged out successfully',
    });
};

export {
    registerUser,
    googleLoginHandler,
    googleCallbackHandler,
    userLogin,
    userModify,
    userDelete,
    userLogout,
    authSelf,
};