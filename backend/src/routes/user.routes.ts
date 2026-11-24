import express from 'express';
import { registerUser, googleLoginHandler, googleCallbackHandler, userLogin, userModify, userDelete, userLogout, authSelf, tokenRefreshHandler, addFavorites, createPlaylist, getMe, getFavorites, profilePageData, getMyPlaylist, getMyPlaylistItems, getArtistProfile } from '../controller/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const userRouter = express.Router();

userRouter.get('/', authMiddleware, getMe);
userRouter.get('/auth/self', authMiddleware, authSelf);
userRouter.post('/register', registerUser);
userRouter.get('/auth/google', googleLoginHandler);
userRouter.get('/auth/google/callback', googleCallbackHandler);
userRouter.post('/login', userLogin);
userRouter.put('/modify', authMiddleware, upload.single("profilePic"), userModify);
userRouter.delete('/delete', authMiddleware, userDelete);
userRouter.post('/logout', authMiddleware, userLogout);
userRouter.get('/auth/refresh', tokenRefreshHandler);
userRouter.put('/addFavorite/:id', authMiddleware, addFavorites);
userRouter.put('/createPlaylist', authMiddleware, createPlaylist);
userRouter.get('/myFavorites', authMiddleware, getFavorites);
userRouter.get('/myProfile', authMiddleware, profilePageData);
userRouter.get('/myPlaylist', authMiddleware, getMyPlaylist);
userRouter.get('/myPlaylistItems/:playlistName', authMiddleware, getMyPlaylistItems);
userRouter.get('/artistData', getArtistProfile);

export default userRouter;