import jwt from "jsonwebtoken";
import { AppError } from "../AppError.js";
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../../constants/index.js";


interface TokenPayload {
    userName?: string;
    userID?: string;
    email?: string;
    _id?: string;
};



async function generateAccessToken({ userName, userID, email }: TokenPayload): Promise<string | undefined> {
    if (!userID) throw new AppError('No userID provided for access token generation!', 400);

    if (!process.env.ACCESS_TOKEN_SECRET_KEY) {
        throw new AppError('ACCESS_TOKEN_SECRET_KEY is not defined in environment variables!', 500);
    }

    const token = jwt.sign({ userName, userID, email }, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: 30 * 60
    })
    if (!token) throw new AppError('No access token generated!', 400);
    return token;
}

async function generateRefreshToken(sessionDocumentID: string): Promise<string | undefined> {
    if (!sessionDocumentID) throw new AppError('No _id provided for refresh token generation!', 400);

    if (!process.env.REFRESH_TOKEN_SECRET_KEY) {
        throw new AppError('REFRESH_TOKEN_SECRET_KEY is not defined in environment variables!', 500);
    }

    const token = jwt.sign({ _id: sessionDocumentID }, process.env.REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: 30 * 60
    });
    if (!token) throw new AppError('No refresh token generated!', 400);
    return token;
}

function verifyToken(token: string, tokenType: 'access' | 'refresh'): { isValid: boolean, data?: any } {
    const tokenSecretKey = tokenType == "access" ? process.env.ACCESS_TOKEN_SECRET_KEY
        : (tokenType == "refresh") ? process.env.REFRESH_TOKEN_SECRET_KEY : null;

    if (!tokenSecretKey) {
        throw new AppError('Token secret key is not defined in environment variables!', 500);
    }

    const tokenData = jwt.verify(token, tokenSecretKey);
    if (!tokenData)
        return { isValid: false };

    return { isValid: true, data: tokenData }
}

export { 
    generateAccessToken, 
    generateRefreshToken, 
    verifyToken, 
};