import mongoose, { Schema, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";
import { AppError } from "../../utils/AppError.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../utils/authUtils/index.js";

interface Session {
    accessToken?: string;
    refreshToken?: string;
    userID: string;
    accessTokenCreatedAt: Date;
    accessTokenExpiresAt: Date;
    refreshTokenCreatedAt: Date;
    refreshTokenExpiresAt: Date;
}

interface SessionMethods {
    generateTokens(userData: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}

type SessionModel = Model<Session, {}, SessionMethods>;

const sessionSchema = new Schema<Session, SessionModel, SessionMethods>(
    {
        accessToken: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
        userID: {
            type: String,
            ref: "user",
            required: true,
        },
        accessTokenCreatedAt: {
            type: Date,
            default: Date.now,
        },
        accessTokenExpiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 30 * 60 * 1000),
        },
        refreshTokenCreatedAt: {
            type: Date,
            default: Date.now,
        },
        refreshTokenExpiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    },
    {
        timestamps: true,
    }
);

sessionSchema.methods.generateTokens = async function (userData:any) {
    const [accessToken, refreshToken] = await Promise.all([
        generateAccessToken(userData),
        generateRefreshToken(this._id.toString()),
    ]);

    if (!accessToken || !refreshToken) {
        throw new AppError("Failed to generate tokens", 500);
    }

    const [hashedAccessToken, hashedRefreshToken] = await Promise.all([
        bcrypt.hash(accessToken, 10),
        bcrypt.hash(refreshToken, 10),
    ]);

    this.accessToken = hashedAccessToken;
    this.refreshToken = hashedRefreshToken;

    await this.save();

    return { accessToken, refreshToken };
};

const sessionModel = mongoose.model<Session, SessionModel>(
    "session",
    sessionSchema
);

export default sessionModel;