import jwt from 'jsonwebtoken';
import User from '../model/user.js'; // Import your User model

const authenticateUser = async (req, res, next) => {
  try {
    // Get the JWT token from the cookie or headers
    const token = req.cookies.user_token || req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      return next();
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded user ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - User not found' });
    }

    // Attach the user object to the request for further use in route handlers
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error during authentication:', error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

export default authenticateUser;