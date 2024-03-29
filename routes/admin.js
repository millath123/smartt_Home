import express from 'express';
const router = express.Router();
import adminController from '../controllers/admin.js';
import productController from '../controllers/product.js';
import isAuthenticated from '../middleware/adminAuthentication.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../servieces/cloudinary.js';
import multer from 'multer';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,                                                           
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

router.get('/register', adminController.adminSighnupPage)

router.get('/login', adminController.adminLoginGetPage)
router.post('/login', adminController.adminLoginPostPage)
router.get('/logout', isAuthenticated, adminController.adminLogout)
router.get('/', isAuthenticated, adminController.adminLogout) 

router.get('/users', isAuthenticated, adminController.adminusers)
router.put('/users/:id', adminController.updateRoute)
router.delete('/users/:id', adminController.deleteRoute)

router.get('/dashboard', isAuthenticated, adminController.adminDshboard)
router.post('/dashboard', adminController.adminLoginPostPage)

router.get('/product', isAuthenticated, productController.adminproduct)
router.post('/upload', upload.array('images', 5), productController.uploadProducts),
router.delete('/products/:id', productController.deleteProduct);

router.get('/banner',isAuthenticated,adminController.bannerGet);
router.post('/addBanner',isAuthenticated,upload.array('bannerImage', 6), adminController.bannerPost);

router.get('/orders',isAuthenticated, adminController.ordersGet);
// router.post('/order',isAuthenticated, adminController.ordersrPost);


// router.get('/admin/passwordReset',adminController.passwordReset)
// router.post('/admin/passwordReset',rs.passwordResetPost)
// router.post('/admin/passwordVerify',adminController.passwordVerifyPost)
// router.get('/admin/NewPassword',adminController.NewPassword)
// router.post('/admin/NewPassword',adminController.NewPasswordPost)

export default router;