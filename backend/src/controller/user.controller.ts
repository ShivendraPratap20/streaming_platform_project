import { Request, Response } from 'express';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { userSignupSchema } from '../validators/user.validation.js';
import userModel from '../model/database/user.model.js';
import { AppError } from '../utils/AppError.js'
import sessionModel from '../model/database/session.model.js';
import { SAME_SITE, SECURE, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY, GOOGLE_REDIRECT_URL, GOOGLE_AUTH_URL, GOOGLE_TOKEN_URL, FRONTEND_URL } from '../constants/index.js';

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
        ...(password && { password }),
        ...(phoneNumber && { phoneNumber }),
        ...(profilePicture && { profilePicture }),
        ...(accountType && { accountType }),
        ...(authorizationType && { authorizationType })
    });

    const tokenData = new sessionModel({ userID: newUser._id });

    const { accessToken, refreshToken }: { accessToken: string, refreshToken: string } = await tokenData.generateTokens();
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

    if(!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URL) {
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

    const { sub, email, name, picture, email_verified }:TokenPayload = payload;

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

    const { accessToken, refreshToken } = await tokenData.generateToken();
    if (accessToken && refreshToken)
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
    res.status(201).json({ status: true, message: "Account Created", data: existingUser });
    res.redirect(FRONTEND_URL);
};

export {
    registerUser,
    googleLoginHandler,
    googleCallbackHandler,
};