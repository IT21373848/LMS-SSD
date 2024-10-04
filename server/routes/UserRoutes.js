import express from 'express';
import { CreateAccount, Login, getUserDetails, sendNewEmail } from '../controllers/UserController.js';
import { LoginValidator } from '../middlewares/LoggedIn.js';
import { facebookAuthInit, facebookCallback } from '../controllers/AuthController.js';

const userRouter = express.Router();

userRouter.get('/get-user', LoginValidator, getUserDetails);
userRouter.post('/login', Login);
userRouter.post('/create', CreateAccount);
userRouter.post('/send-email', sendNewEmail);
// Initiates the Facebook Login flow
userRouter.get('/auth/facebook', facebookAuthInit);
userRouter.get('/auth/facebook/callback', facebookCallback)

export default userRouter;