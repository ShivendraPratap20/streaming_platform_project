import express from 'express';
import { registerUser, googleLoginHandler, googleCallbackHandler } from '../controller/user.controller.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.get('/auth/google', googleLoginHandler);
userRouter.get('/auth/google/callback', googleCallbackHandler);

export default userRouter;