import axios from "axios";
import UserModel from "../models/UserModel.js";
import { createToken } from "./UserController.js";

const APP_ID = '3857556554491739';
const APP_SECRET = 'e31241bb6b200e93050112161a306874';
const REDIRECT_URI = 'http://localhost:5000/auth/facebook/callback';
const CLIENT_URL = 'http://localhost:5173';

export const facebookAuthInit = (req, res) => {
    const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&scope=email`;
    res.redirect(url);
}

// Callback URL for handling the Facebook Login response
export const facebookCallback = async (req, res) => {
    const { code } = req.query;

    try {
        // Exchange authorization code for access token
        const { data } = await axios.get(`https://graph.facebook.com/v13.0/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}&code=${code}&redirect_uri=${REDIRECT_URI}`);

        const { access_token } = data;

        // Use access_token to fetch user profile
        const { data: profile } = await axios.get(`https://graph.facebook.com/v13.0/me?fields=name,email&access_token=${access_token}`);

        console.log(profile)

        if (!profile.email) {
            throw Error('No Email Found')
        }

        const isExist = await UserModel.findOne({ email: profile.email })

        console.log('eXISIT', isExist)

        if (isExist) {
            const token = createToken(isExist?._id);
            // res.cookie('token', token, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) });
            // res.cookie('firstName', isExist?.firstName, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) });
            // res.cookie('userRole', isExist?.role, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) });

            res.redirect(CLIENT_URL + '/loginSuccess?token=' + token + '&firstName=' + isExist?.firstName + '&userRole=' + isExist?.role);
            // res.status(200).json({
            //     token,
            //     userRole: isExist.role,
            //     firstName: isExist.firstName
            // })
        } else {
            const newUser = new UserModel({
                firstName: profile.name.split(" ")[0],
                lastName: profile.name.split(" ")[1],
                email: profile.email,
                password: profile?.name?.split(" ")[0] + profile?.name?.split(" ")[1],
                role: 'student'
            })
            await newUser.save()
            const token = createToken(newUser?._id);
            // res.cookie('token', token, { httpOnly: true });
            // res.cookie('firstName', newUser?.firstName, { httpOnly: true });
            // res.cookie('userRole', newUser?.role, { httpOnly: true });
            res.redirect(CLIENT_URL + '/loginSuccess?token=' + token + '&firstName=' + newUser?.firstName + '&userRole=' + newUser?.role);
        }
        // Code to handle user authentication and retrieval using the profile data
    } catch (error) {
        console.error('Error:', error?.response?.data?.error || error?.message);
        res.redirect(CLIENT_URL + '/login');
    }
}