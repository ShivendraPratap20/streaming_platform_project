import { Request, Response } from 'express';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { userSignupSchema, userLoginSchema, userUpdateSchema } from '../validators/user.validation.js';
import userModel from '../model/database/user.model.js';
import { AppError } from '../utils/AppError.js'
import sessionModel from '../model/database/session.model.js';
import { SAME_SITE, SECURE, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY, GOOGLE_REDIRECT_URL, GOOGLE_AUTH_URL, GOOGLE_TOKEN_URL, FRONTEND_URL } from '../constants/index.js';
import { verifyToken } from '../utils/authUtils/index.js';
import mediaModel from '../model/database/media.model.js';

const getMe = async (req: Request, res: Response) => {
    const { isAuthenticated, authenticatedUserData } = req;

    const { _id, userID, userName, email } = authenticatedUserData;

    if(!isAuthenticated)
        return res.status(401).json({ status: false, message: 'Not Authenticated' });

    const userData = await userModel.findOne({ _id, userID, userName, email });
    if(!userData)
        return res.status(404).json({ status: false, message: 'Not found'});

    console.log(userData);

    res.status(202).json({ status: true, message: 'User found', data: userData });
};

const authSelf = async (req: Request, res: Response) => {
    const isAuthenticated: boolean | undefined = req.isAuthenticated;
    if (!isAuthenticated)
        return res.status(401).json({ status: false, message: 'Not Authenticated' });

    res.status(200).json({ status: true, message: 'Authenticated', data: req.authenticatedUserData });
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

    const tokenData = new sessionModel({ userID: userData.userID });

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

    updatingData = await userUpdateSchema.parseAsync(updatingData);

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

const tokenRefreshHandler = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token)
        throw new AppError('No Session', 401);

    const { isValid, data } = verifyToken(token, "refresh");

    if (!isValid)
        throw new AppError('Session Expired', 401);

    const sessionData = await sessionModel.findOne({ _id: data._id });

    if (!sessionData || (new Date(sessionData.refreshTokenExpiresAt).getTime() < Date.now()))
        throw new AppError('Session Expired', 401);

    const userData = await userModel.findOne({ userID: sessionData.userID });
    const tokenData = new sessionModel({ userID: sessionData.userID });

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
    res.status(200).json({status: true, message: 'Tokens generated'});
};

const addFavorites = async (req: Request, res: Response) => {
    let mediaObjectID = req.params.id;
    const { _id, userName, userID } = req.authenticatedUserData

    const _mediaID = new mongoose.Types.ObjectId(mediaObjectID);

    if ((!_mediaID || !mongoose.isValidObjectId(_mediaID)))
        throw new AppError('Invalid media ID', 400);

    const mediaData = await mediaModel.findOne({ _id: _mediaID });
    if (!mediaData)
        throw new AppError('No media found', 404);

    const updateUserMediaData = await userModel.findOneAndUpdate({ _id, userName, userID }, {
        $push: { favorites: _mediaID }
    });

    if (!updateUserMediaData)
        throw new AppError('Faild to add to favorite', 400);

    res.status(202).json({
        status: true,
        message: 'Added to favorites'
    });
};

const createPlaylist = async (req: Request, res: Response) => {
    const { playlistName, playlistItemName } = req.body;
    const { _id, userID, userName } = req.authenticatedUserData;

    if (!playlistName)
        return res.status(200).json({});


    const _mediaID = playlistItemName ?? new mongoose.Types.ObjectId(playlistItemName);
    const mediaData = await mediaModel.findOne({ _id: _mediaID });
    if (!mediaData)
        throw new AppError('No media found for given ID', 404);


    const existingPlaylist = await userModel.findOneAndUpdate(
        {
            _id,
            userID,
            userName,
            "playlist.playlistName": playlistName
        },
        {
            $addToSet: {
                "playlist.$.playlistItems": _mediaID
            },
            $inc: {
                "playlist.$.totalDuration": mediaData.mediaDetails?.duration || 0
            }
        },
        { new: true }
    );

    let playlist = existingPlaylist;

    if (!existingPlaylist) {
        playlist = await userModel.findOneAndUpdate(
            { _id, userID, userName },
            {
                $push: {
                    playlist: {
                        playlistName,
                        playlistItems: [_mediaID],
                        totalDuration: mediaData.mediaDetails?.duration || 0
                    }
                }
            },
            { new: true }
        );
    }
    if (!playlist)
        throw new AppError('Failed to create/add playlist', 400);

    res.status(202).json({ status: true, message: 'Added to playlist' });

};

const getFavorites = async (req: Request, res: Response) => {
    const { _id, userID, userName } = req.authenticatedUserData;
    if(!_id || !userID || !userName) return res.status(401).json({});

    const userData = await userModel.findOne({ _id, userID, userName });
    const { favorites } = userData;

    if(!userData)
        throw new AppError('No user found', 404);

    const favData = await mediaModel.find({ _id: { $in: [...favorites]}});

    res.status(200).json({ status: true, data: favData})
};

export {
    getMe,
    registerUser,
    googleLoginHandler,
    googleCallbackHandler,
    userLogin,
    userModify,
    userDelete,
    userLogout,
    authSelf,
    tokenRefreshHandler,
    addFavorites,
    createPlaylist,
    getFavorites,
};