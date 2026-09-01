/**
 * Nexorithm 2026 - Unified Node.js, Express & MongoDB Backend Server
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Route Handlers
const registrationRoutes = require('./routes/registrationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Core Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(cookieParser());

// Static Files (Frontend UI, CSS, JS, Assets, Uploads)
app.use(express.static(path.join(__dirname, './')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =========================================================================
// API ROUTES (Modern REST & Backward-Compatible Aliases)
// =========================================================================

// Modern REST endpoints
app.use('/api/registration', registrationRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);

// Backward-compatible route aliases (ensures existing frontend calls work immediately)
app.use('/api/registration.php', registrationRoutes);
app.use('/api/delete_registration.php', (req, res, next) => {
  req.url = '/delete';
  registrationRoutes(req, res, next);
});
app.use('/api/update_status.php', (req, res, next) => {
  req.url = '/status';
  registrationRoutes(req, res, next);
});
app.use('/api/admin_login.php', (req, res, next) => {
  req.url = '/login';
  adminRoutes(req, res, next);
});
app.use('/api/admin_session.php', (req, res, next) => {
  req.url = '/session';
  adminRoutes(req, res, next);
});
app.use('/api/admin_logout.php', (req, res, next) => {
  req.url = '/logout';
  adminRoutes(req, res, next);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Nexorithm 2026 Node.js / Express & MongoDB',
    timestamp: new Date().toISOString()
  });
});

// Frontend SPA fallback - serve index.html for root or unknown pages
app.get('*', (req, res) => {
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found.' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Nexorithm 2026 Server running at: http://localhost:${PORT}`);
  console.log(`📡 MongoDB API Endpoint: http://localhost:${PORT}/api/registration`);
  console.log(`🛡️  Admin Portal: http://localhost:${PORT}/#admin`);
  console.log(`=======================================================`);
});
