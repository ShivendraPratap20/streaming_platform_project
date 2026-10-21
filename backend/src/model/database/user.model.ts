import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AppError } from '../../utils/AppError.js';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        minlength: [5, 'User name must be at least 5 characters long'],
        maxlength: [30, 'User name must be at most 30 characters long'],
    },
    userID: { type: String, required: true, unique: true, trim: true },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 254,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please provide a valid email address.',
        ],
    },
    password: { type: String },
    phoneNumber: {
        type: Number, validate: {
            validator: function (value: number) {
                return /^\d{10}$/.test(value.toString());
            },
            message: 'Phone number must be a 10-digit number.',
        }
    },
    profilePicture: { type: String, default: null, trim: true },
    tokens: [{ token: { type: String } }],
    accountType: { type: String, enum: ['USER', 'CREATOR'], default: 'USER' },
    authorizationType: { type: String, enum: ['EMAIL', 'GOOGLEAUTH'], default: 'EMAIL' },
    isEmailVerified: { type: Boolean, default: false },
    mediaFiles: {
        videoFiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
        audioFiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }]
    },

}, { timestamps: true });

userSchema.methods.generateToken = async function () {
    if (process.env.SECRET_KEY === undefined) {
        throw new AppError('SECRET_KEY is not defined in the environment variables.', 500);
    }
    const token = await jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
};

userSchema.pre('save', async function (next) {
    if (this.isModified("password") && this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const userModel = mongoose.model('user', userSchema);

export default userModel;