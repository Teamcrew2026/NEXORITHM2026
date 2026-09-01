const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');
const Admin = require('../models/Admin');

// Ensure SRV DNS resolution works reliably on Windows / all ISPs
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // ignore if restricted
}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexorithm_2026';
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Seed default admin if no admin accounts exist
    await seedDefaultAdmin();

    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.warn(`[MongoDB Warning] Make sure your database username & password in .env are correct and Network Access is set to 0.0.0.0/0 in MongoDB Atlas.`);
  }
};

const seedDefaultAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultUser = process.env.DEFAULT_ADMIN_USER || 'nexorithm';
      const defaultPass = process.env.DEFAULT_ADMIN_PASS || 'cybercrew';
      
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(defaultPass, salt);

      await Admin.create({
        username: defaultUser,
        passwordHash
      });

      console.log(`[Admin Seed] Default admin created -> Username: "${defaultUser}" | Password: "${defaultPass}"`);
    }
  } catch (err) {
    console.error('[Admin Seed Error]', err.message);
  }
};

module.exports = connectDB;
