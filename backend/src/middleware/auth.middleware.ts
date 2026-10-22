import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/authUtils/index.js';
import { sessionModel } from '../model/database/index.js';
import bcrypt from 'bcryptjs';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    req.isAuthenticated = false;
    req.authenticatedUserData = null;

    const accessToken = req.cookies?.accessToken;
    if (!accessToken)
        return res.status(401).json({status: false, message: 'Access token missing/invalid'});;

    const tokenVerificationResult = verifyToken(accessToken, "access");

    if (!tokenVerificationResult.isValid)
        return res.status(401).json({status: false, message: 'Access token expired/invalid'});;

    const { data } = tokenVerificationResult;

    const sessionData = await sessionModel.findOne({ userID: data.userID });
    
    if (sessionData && new Date(sessionData.accessTokenExpiresAt).getTime() > Date.now()) {
        req.isAuthenticated = true;
        req.authenticatedUserData = data;
        return next();
    }
    return  res.status(401).json({status: false, message: 'Not Authenticated'});;
};

export default authMiddleware;