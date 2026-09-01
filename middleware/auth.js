const jwt = require('jsonwebtoken');

const requireAdminAuth = (req, res, next) => {
  try {
    let token = null;

    // Check authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check cookie
    else if (req.cookies && req.cookies.admin_token) {
      token = req.cookies.admin_token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required.'
      });
    }

    const secret = process.env.JWT_SECRET || 'nexorithm_2026_super_secure_jwt_secret_key_998877';
    const decoded = jwt.verify(token, secret);

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.'
    });
  }
};

module.exports = { requireAdminAuth };
