import path from 'path';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Admin from '../model/admin.js';
import User from '../model/user.js';
import adminHelpers from "../helpers/adminHelpers.js"
import cloudinary from '../servieces/cloudinary.js';
import Product from '../model/product.js';
import { log } from 'util';

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
  try {
    const { email, password } = req.body;
    const loginResponse = await adminHelpers.adminLoginHelper({ email, password });

    if (loginResponse.admin) {
      res.cookie('adminToken', loginResponse.savedAdmin._id.toString());
      res.redirect('/admin/dashboard');
    } else if (loginResponse.passwordMismatch) {
      res.status(401).send('Incorrect Password');
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
  try {
    const users = await adminHelpers.adminusersHelper();
    res.render('admin/users', { users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


const deleteUserController = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await adminHelpers.deleteUserHelper(userId);
    if (!deletedUser) {
      return res.status(404).json({ pageNotFound: '404page' })
    }

    res.status(204).json({ delete: 'success' })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

const updateUserController = async (req, res) => {
  const userId = req.params.id;
  const { fullName, phoneNumber, email } = req.body;
  try {
    const updatedUser = await adminHelpers.updateUserHelper(userId, fullName, phoneNumber, email);

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.send(updatedUser);
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
  const admin = req.admin;
  console.log(req.body);
  const { files } = req;
  console.log(files);
  try {
    const {
      bannerProduct,
      bannerAnnouncement,
      bannerDescription,
      bannerPrice,
    } = req.body;
    const bannerImages = files.map((file) => file.path); // Assuming files contain banner images

    const parsedBannerPrice = Number(bannerPrice);

    const mainNewBanner = {
      bannerImage: [bannerImages[0]],
      bannerProduct,
      bannerAnnouncement,
      bannerDescription,
      bannerPrice: parsedBannerPrice,
    };

    const secondNewBanner = {
      bannerImage: [bannerImages[1], bannerImages[2]],
      bannerProduct,
      bannerAnnouncement,
      bannerDescription,
      bannerPrice: parsedBannerPrice,
    };

    const thirdNewBanner = {
      bannerImage: [bannerImages[3], bannerImages[4], bannerImages[5]],
      bannerProduct,
      bannerAnnouncement,
      bannerDescription,
      bannerPrice: parsedBannerPrice,
    };
    admin.banners = {
      mainBanners: [mainNewBanner],
      secondBanners: [secondNewBanner],
      thirdBanners: [thirdNewBanner],
    };

    await admin.save();

    res.status(201).json({ message: 'Banner created successfully' });
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ error: 'Failed to create banner' });
  }
};


// order list
const ordersGet = async function (req, res) {
  const { user } = req;
  res.render('../views/admin/orders', { user });
};

export default {
  adminSighnupPage,
  adminLoginGetPage,
  adminLoginPostPage,
  adminLogout,
  adminDshboard,
  adminusers,
  bannerGet,
  bannerPost,
  deleteRoute,
  updateRoute,
  deleteUserController,
  ordersGet,
};