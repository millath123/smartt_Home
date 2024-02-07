import express from 'express';
const router = express.Router();
import adminController from '../controllers/admin.js';
import authenticateUser from '../middleware/adminAuthentication.js';
import isAuthenticated from '../middleware/adminAuthentication.js';


router.get('/register',adminController.adminSighnupPage)

router.get('/adminLogin',adminController.adminLoginGetPage)
 router.get('/dashboard',isAuthenticated,adminController.adminLoginGgetPage)
router.post('/adminLogin',adminController.adminLoginPostPage)
router.get('/adminLogout',isAuthenticated,adminController.adminLogoutPage)
router.post('/dashboard',adminController.adminDshboard)


// router.get('/dashboard',adminController.adminDshboard)
// router.get('/dashboard',adminController.adminDshboard)

// router.get('/admin/passwordReset',adminController.passwordReset)
// router.post('/admin/passwordReset',rs.passwordResetPost)
// router.post('/admin/passwordVerify',adminController.passwordVerifyPost)
// router.get('/admin/NewPassword',adminController.NewPassword)
// router.post('/admin/NewPassword',adminController.NewPasswordPost)


export default router;