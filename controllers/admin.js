import express from 'express';
import path from 'path';
import bcrypt from 'bcrypt';
import Admin from '../model/admin.js';
import User from '../model/user.js';
import Product from '../model/product.js';
import isAuthenticated from '../middleware/adminAuthentication.js';
require('dotenv').config();

const router = express.Router();


const adminSighnupPage = async (req, res) => {
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
    res.render(path.join('../views/admin/login'));
  }

const adminLoginGgetPage =async (req, res) => {
    try {
      const adminId = req.cookies.adminToken;
      const admin = await Admin.findById(adminId);
  
      if (!admin) {
        return res.status(401).redirect('/admin/login');
      }
  
      res.render(path.join( '../views/admin/index'), { admin });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching admin details');
    }
  }

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
                res.send('Wrong Password or EmailId');
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving user.');
    }
}
// Assuming this code is within a router instance
router.get('/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.redirect('/admin/dashboard');
  });
  

export default {
    adminSighnupPage,
    adminLoginGetPage,
    adminLoginGgetPage,
    adminLoginPostPage,
    adminLogout

};