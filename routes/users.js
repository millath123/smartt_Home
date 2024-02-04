import express from 'express';
const router = express.Router();
import userController from '../controllers/user.js';


router.get('/', userController.homePage)
router.get('/userSignup', userController.signUpGetPage)
router.post('/send-otp', userController.sendOtp)
router.get('/active/:otp', userController.activeOtp)
router.get('/passwordConformation', userController.passwordConformationPage)
router.get('/passwordConformation', userController.passwordConformationPage)


export default router; 