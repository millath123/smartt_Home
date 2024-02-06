import express from 'express';
const router = express.Router();
import adminController from '../controllers/admin.js';
import authenticateUser from '../middleware/adminAuthentication.js';
import isAuthenticated from '../middleware/adminAuthentication.js';


router.get('/register',isAuthenticated,adminController.adminSighnupPage)

router.get('/adminLogin',isAuthenticated,adminController.adminLoginGetPage)
router.get('/admin/dashboard',isAuthenticated,adminController.adminLoginGgetPage)
router.post('/adminLogin',isAuthenticated,adminController.adminLoginPostPage)
router.get('/adminLogout',isAuthenticated,adminController.adminLogout)
router.get('/admin/passwordReset',adminController.passwordReset)
router.post('/admin/passwordReset',adminController.passwordResetPost)
router.post('/admin/passwordVerify',adminController.passwordVerifyPost)
router.get('/admin/NewPassword',adminController.NewPassword)
router.post('/admin/NewPassword',adminController.NewPasswordPost)






export default router; 