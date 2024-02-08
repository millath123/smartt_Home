import express from 'express';
const router = express.Router();
import userController from '../controllers/user.js';
import authenticateUser from '../middleware/userAuathentication.js';
import productController from '../controllers/product.js';

router.get('/',authenticateUser, userController.homePage)
router.get('/userSignup', userController.signUpGetPage)
router.post('/send-otp', userController.sendOtp)
router.get('/active/:otp', userController.activeOtp)
router.get('/passwordConformation', userController.passwordConformationPage)
router.post('/set-password', userController.setSignupPassword)
router.get('/login', userController.loginGetPage)
router.post('/login', userController.loginPostPage)
router.post('/login', userController.loginPostPage)
router.get('/googleauth/google', userController.googleLogin);
router.get('/auth/google/callback', userController.googleLoginCallback);


router.get('/product',authenticateUser,productController.getProduct);
router.post('/addToCart',authenticateUser,productController.addToCart);
router.get("/cart",authenticateUser,productController.getCart);
router.get('/checkout',authenticateUser,authenticateUser,productController.getCheckout);
router.delete('/checkout/:profileId',authenticateUser,productController.deleteProfile);
router.post('/placeorder',authenticateUser, productController.placeOrder);



export default router;