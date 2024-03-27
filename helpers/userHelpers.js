import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import path from 'path';
import bcrypt from 'bcrypt';
import axios from 'axios';
import dotenv from 'dotenv';
import transporter from '../servieces/nodemailer.js';
import generateOTP from '../servieces/generateOtp.js';
import User from '../model/user.js';
import Profile from '../model/user.js';
import Product from '../model/product.js';

const { OK, INTERNAL_SERVER_ERROR } = httpStatus;
dotenv.config();

const activeOtpHelper = async (urlOtp, storedOtpHash) => {
    try {
        if (typeof urlOtp !== 'string' || typeof storedOtpHash !== 'string') {
            throw new Error('Invalid OTP or OTP hash');
        }

        const result = await bcrypt.compare(urlOtp, storedOtpHash);

        return result;
    } catch (error) {
        throw new Error('Error comparing OTPs');
    }
};

const setSignupPasswordHelper = async (email, fullName, phoneNumber, newPassword, confirmNewPassword) => {
    if (newPassword !== confirmNewPassword) {
        throw new Error('Passwords do not match.');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error('Email is already in use. Please use a different email.');
        }

        const newUser = new User({
            fullName,
            phoneNumber,
            email,
            password: hashedPassword,
        });

        await newUser.save();
    } catch (err) {
        throw err;
    }
}

const loginPostHelper = async (email, password) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return { error: 'Invalid Email Address' };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return { error: 'Password does not match' };
        }

        const user_token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        user.token = user_token;
        await user.save();

        return user;
    } catch (error) {
        throw error;
    }
};

const googleLoginHelper = () => {
    const googleAuthUrl = process.env.GOOGLE_AUTH_URL;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.callbackURL;
    const scope = process.env.SCOPE;

    const url = `${googleAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

    return url;
};


const googleLoginCallbackHelper = async (code) => {
    const googleTokenUrl = process.env.GOOGLE_TOKEN_URL;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLINT_SECRET;
    const redirectUri = process.env.callbackURL;

    try {
        const tokenResponse = await axios.post(googleTokenUrl, {
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
        });

        const { access_token, id_token } = tokenResponse.data;

        // Fetch user information using the access token
        const USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';
        const userInfoResponse = await axios.get(USERINFO_URL, {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const userData = userInfoResponse.data;

        let user;

        const existingUser = await User.findOne({ googleId: userData.sub });

        if (!existingUser) {
            user = new User({
                fullName: userData.name,
                googleId: userData.sub,
                email: userData.email,
                image: userData.picture,
            });
            user = await user.save();
        } else {
            existingUser.fullName = userData.name;
            existingUser.email = userData.email;
            existingUser.image = userData.picture;
            user = await existingUser.save();
        }

        const user_token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        return { user_token };
    } catch (error) {
        throw error;
    }
};

const logoutHelper = (res) => {
    res.clearCookie('user_token');
    res.redirect('/');
};

const getProfileHelper = (res, user) => {
    try {
        res.render(path.join('../views/user/profile'), { profile: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error rendering user profile' });
    }
};


const createProfileHelper = async (user, profileData) => {
    try {
        user.address.push(profileData);
        // Assuming user.save() is a function that saves the user profile
        const updatedUser = await user.save();
        return updatedUser;
    } catch (error) {
        throw new Error('Error saving user profile to the database');
    }
};

const deleteProfileHelper = async (profileId) => {
    try {
        await User.findOneAndDelete({ _id: profileId });
    } catch (error) {
        throw new Error('Error deleting profile');
    }
};


const updateProfileHelper = async (profileId, updatedData) => {
    try {
        const updatedProfile = await Profile.findByIdAndUpdate(profileId, updatedData, { new: true });
        return updatedProfile;
    } catch (error) {
        throw new Error('Error updating profile');
    }
};

const GetProductPageHelper = async () => {
    try {
        const products = await Product.find().exec();
        return products;
    } catch (error) {
        throw new Error('Error fetching products');
    }
};

const getProductDetailsHelper = async (productId) => {
    try {
        const product = await Product.findById(productId);
        return product;
    } catch (error) {
        throw new Error('Error fetching product details');
    }
};

const GetProductCategoryHelper = async (category) => {
    try {
        let filteredProducts;

        if (category === 'extension' || category === 'standalone' || category === 'starter') {
            filteredProducts = await Product.find().limit(5).exec();
        } else if (category === 'bestquality' || category === 'featured' || category === 'newproducts') {
            filteredProducts = await Product.find().limit(5).exec();
        } else if (category === 'allproducts' || category === 'sortbypopularity') {
            filteredProducts = await Product.find().exec();
        } else if (category === 'alphabeticallyaz') {
            filteredProducts = await Product.find().sort({ productName: 1 }).exec();
        } else if (category === 'sortbylowtohigh') {
            filteredProducts = await Product.find().sort({ productPrice: -1 }).exec();
        } else if (category === 'sortbyhightolow') {
            filteredProducts = await Product.find().sort({ productPrice: 1 }).exec();
        } else {
            filteredProducts = await Product.find({ category: category }).exec();
        }

        return filteredProducts;
    } catch (error) {
        throw new Error('Error fetching filtered products');
    }
};


const searchProductsHelper = async (query) => {
    try {
        // Perform the search in your Products collection based on the query
        const filteredProducts = await Product.find({ name: { $regex: new RegExp(query, 'i') } }).exec();
        return filteredProducts;
    } catch (err) {
        // Handle errors
        console.error('Error searching for products:', err);
        throw new Error('Internal Server Error');
    }
};

const pageNotFoundHelper = (req, res) => {
    const { user } = req;
    res.render('../views/user/404page');
};





export default {
    activeOtpHelper,
    setSignupPasswordHelper,
    loginPostHelper,
    googleLoginHelper,
    googleLoginCallbackHelper,
    logoutHelper,
    getProfileHelper,
    createProfileHelper,
    deleteProfileHelper,
    updateProfileHelper,
    GetProductPageHelper,
    getProductDetailsHelper,
    GetProductCategoryHelper,
    pageNotFoundHelper,
    searchProductsHelper
};