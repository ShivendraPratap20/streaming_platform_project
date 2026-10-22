import express from 'express';
import { registerUser, googleLoginHandler, googleCallbackHandler, userLogin, userModify, userDelete, userLogout, authSelf } from '../controller/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const userRouter = express.Router();

userRouter.get('/auth/self', authMiddleware, authSelf);
userRouter.post('/register', registerUser);
userRouter.get('/auth/google', googleLoginHandler);
userRouter.get('/auth/google/callback', googleCallbackHandler);
userRouter.post('/login', userLogin);
userRouter.put('/modify', authMiddleware, userModify);
userRouter.delete('/delete', authMiddleware, userDelete);
userRouter.post('/logout', authMiddleware, userLogout);

export default userRouter;