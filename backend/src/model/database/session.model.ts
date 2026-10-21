import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { AppError } from "../../utils/AppError.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/authUtils/index.js";


const sessionSchema = new mongoose.Schema({
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
    },
    userID: {
        type: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    },
    accessTokenCreatedAt: {
        type: Date,
        default: Date.now
    },

    accessTokenExpiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 60 * 1000)
    },

    refreshTokenCreatedAt: {
        type: Date,
        default: Date.now
    },

    refreshTokenExpiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
}, {
    timestamps: true
});

sessionSchema.methods.generateTokens = async function (): Promise<{ accessToken: string, refreshToken: string }> {
    const [ accessToken, refreshToken ] = await Promise.all([
        generateAccessToken(this),
        generateRefreshToken(this._id.toString())
    ]);

    if(!accessToken || !refreshToken) throw new AppError('Failed to generate tokens', 500);

    this.accessToken = await bcrypt.hash(accessToken, 10);
    this.refreshToken = await bcrypt.hash(refreshToken, 10);
    await this.save()
    return { accessToken, refreshToken }
}


const sessionModel = mongoose.model("session", sessionSchema);


export default sessionModel;