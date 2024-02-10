/* eslint-disable consistent-return */
import path from 'path';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Admin from '../model/admin.js';
import User from '../model/user.js';

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

const adminLoginGetPage = async (req, res) => {
  if (req.cookies.adminToken) {
    res.redirect('/admin');
  }
  res.render(path.join('../views/admin/login'));
};

const adminusers = async (req, res) => {
  const users = await User.find();
  res.render('admin/users', { users });
};

const adminbanner = async (req, res) => {
  res.render(path.join('../views/admin/banner'));
};

const adminLoginPostPage = async (req, res) => {
  const { email, password } = req.body;

  try {
    const savedAdmin = await Admin.findOne({ email });

    if (savedAdmin) {
      const matchPass = await bcrypt.compare(password, savedAdmin.password);
      if (matchPass) {
        res.cookie('adminToken', savedAdmin._id.toString());
        res.redirect('/admin');
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

const adminLogout = (req, res) => {
  res.clearCookie('adminToken');
  res.redirect('/admin/dashboard');
};

// admin dashboard

const adminDshboard = async function (req, res) {
  res.render(path.join('../views/admin/dashboard'));
};

const adminLogoutPage = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndRemove(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send('Error deleting user.');
  }
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

// eslint-disable-next-line consistent-return
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

export default {
  adminSighnupPage,
  adminLoginGetPage,
  adminLoginPostPage,
  adminLogout,
  adminDshboard,
  adminLogoutPage,
  adminusers,
  adminbanner,
  deleteRoute,
  updateRoute,
  deleteUserController,
};
