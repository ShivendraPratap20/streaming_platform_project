import { Request, Response } from 'express';
import { userSignupSchema } from '../validators/user.validation.js';
import userModel from '../model/database/user.model.js';
import { AppError } from '../utils/AppError.js'

const registerUser = async(req: Request, res: Response) => {
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
    await newUser.save();

    res.status(201).json({ message: 'User data is valid', data: newUser });
};

export { registerUser };