import express from 'express';
const router = express.Router();
import adminController from '../controllers/admin.js';
import productController from '../controllers/product.js';
import authenticateUser from '../middleware/adminAuthentication.js';
import isAuthenticated from '../middleware/adminAuthentication.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../helpers/cloudinary.js';
import multer from 'multer';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'uploads', 
      allowed_formats: ['jpg', 'png', 'jpeg'],
    },
  });
  
  const upload = multer({ storage });


router.get('/register',adminController.adminSighnupPage)

router.get('/login',adminController.adminLoginGetPage)
 router.get('/',isAuthenticated,adminController.adminLoginGgetPage)
router.post('/adminLogin',adminController.adminLoginPostPage)
router.get('/logout',isAuthenticated,adminController.adminLogout)
router.get('/dashboard',isAuthenticated,adminController.adminDshboard)
router.get('/users',isAuthenticated,adminController.adminusers)

router.get('/banner',isAuthenticated,adminController.adminbanner)

router.put('/users/:id',adminController.updateRoute)
router.delete('/user/:id', adminController.deleteUserController);

router.post('/dashboard',adminController.adminLoginPostPage)


router.get('/product',isAuthenticated,productController.adminproduct)
router.post('/upload',upload.array('images', 5), productController.uploadImages),
router.delete('/products/:id',productController.deleteProduct)
router.put('/products/:id',productController.updateProduct)

// router.get('/users'adminController.)

// router.get('/dashboard',adminController.adminDshboard)
// router.get('/dashboard',adminController.adminDshboard)

// router.get('/admin/passwordReset',adminController.passwordReset)
// router.post('/admin/passwordReset',rs.passwordResetPost)
// router.post('/admin/passwordVerify',adminController.passwordVerifyPost)
// router.get('/admin/NewPassword',adminController.NewPassword)
// router.post('/admin/NewPassword',adminController.NewPasswordPost)


export default router;