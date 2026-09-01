const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * @route   POST /api/admin/login
 * @desc    Authenticate admin & set JWT cookie
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.'
      });
    }

    const admin = await Admin.findOne({ username: username.toLowerCase().trim() });

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    const secret = process.env.JWT_SECRET || 'nexorithm_2026_super_secure_jwt_secret_key_998877';
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      secret,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.json({
      success: true,
      message: 'Authentication successful. Welcome Administrator!',
      username: admin.username,
      token
    });

  } catch (error) {
    console.error('[Admin Login Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

/**
 * @route   GET /api/admin/session
 * @desc    Check if current request has a valid admin session
 */
router.get('/session', async (req, res) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.admin_token) {
      token = req.cookies.admin_token;
    }

    if (!token) {
      return res.json({
        success: true,
        authenticated: false
      });
    }

    const secret = process.env.JWT_SECRET || 'nexorithm_2026_super_secure_jwt_secret_key_998877';
    const decoded = jwt.verify(token, secret);

    return res.json({
      success: true,
      authenticated: true,
      username: decoded.username
    });

  } catch (err) {
    return res.json({
      success: true,
      authenticated: false
    });
  }
});

/**
 * @route   POST /api/admin/logout
 * @desc    Clear admin session cookie
 */
router.post('/logout', (req, res) => {
  res.clearCookie('admin_token');
  return res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});

module.exports = router;
