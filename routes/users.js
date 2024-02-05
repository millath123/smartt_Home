import express from 'express';
const router = express.Router();
import userController from '../controllers/user.js';
import authenticateUser from '../middleware/userAuathentication.js';


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




export default router; 