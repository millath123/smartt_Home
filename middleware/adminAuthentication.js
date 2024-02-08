import adminmodel from '../model/admin.js';

export default async function isAuthenticated(req, res, next) {
  try {
    if (!req.cookies.adminToken) {
      return res.status(401).redirect('/admin/login');
    }

    const admin = await adminmodel.findById(req.cookies.adminToken);

    if (!admin) {
      return res.status(401).redirect('/admin/login');
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}