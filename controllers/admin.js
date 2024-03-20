import path from 'path';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Admin from '../model/admin.js';
import User from '../model/user.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../helpers/cloudinary.js';
import multer from 'multer';




dotenv.config();

// admin registration
async function adminSighnupPage() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const newAdmin = new Admin({
        email: adminEmail,
        password: hashedPassword,
    });
    await newAdmin.save();
}

// admin login
const adminLoginGetPage = async (req, res) => {
    if (req.cookies.adminToken) {
        res.redirect('/admin/dashboard');
    }
    res.render(path.join('../views/admin/login'));
};


const adminLoginPostPage = async (req, res) => {
    const { email, password } = req.body;

    try {
        const savedAdmin = await Admin.findOne({ email });

        if (savedAdmin) {
            const matchPass = await bcrypt.compare(password, savedAdmin.password);
            if (matchPass) {
                res.cookie('adminToken', savedAdmin._id.toString());
                res.redirect('/admin/dashboard');
            } else {
                res.status(401).send('Incorrect Password');
            }
        } else {
            res.status(404).send('Admin with provided email not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


// admin logout
const adminLogout = (req, res) => {
    res.clearCookie('adminToken');
    res.redirect('/admin/dashboard');
};

// admin dashboard
const adminDshboard = async function (req, res) {
    res.render(path.join('../views/admin/dashboard'));
};

// users list
const adminusers = async (req, res) => {
    const users = await User.find();
    res.render('admin/users', { users });
};

const deleteUserController = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByIdAndRemove(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting user.');
    }
};


const updateUserController = async (req, res) => {
    const userId = req.params.id;
    const { fullName, phoneNumber, email } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update the user's information
        user.fullName = fullName;
        user.phoneNumber = phoneNumber;
        user.email = email;

        await user.save();
        res.send({ ok: 'pp' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user');
    }
};

const deleteRoute = async (req, res) => {
    await deleteUserController(req, res);
};

const updateRoute = async (req, res) => {
    await updateUserController(req, res);
};



const bannerGet = async (req, res) => {
    res.render(path.join('../views/admin/banner'));
};


const bannerPost = async (req, res) => {
  try {
    const { bannerProduct, bannerAnnouncement, bannerDescription, bannerPrice } = req.body;
    const { path: bannerImagePath } = req.file; 

    const parsedBannerPrice = Number(bannerPrice);

    const admin = req.admin;

    admin.banners.push({
      bannerImage: req.file.path, 
      bannerProduct,
      bannerAnnouncement,
      bannerDescription,
      bannerPrice: parsedBannerPrice,
    });

    await admin.save();

    res.status(200).json({ message: 'Banner added successfully' });
  } catch (error) {
    console.error('Error adding banner:', error);
    res.status(500).json({ error: 'Failed to add banner' });
  }
};

export default {
    adminSighnupPage,
    adminLoginGetPage,
    adminLoginPostPage,
    adminLogout,
    adminDshboard,
    // adminLogoutPage,
    adminusers,
    bannerGet,
    bannerPost,
    deleteRoute,
    updateRoute,
    deleteUserController,
};
