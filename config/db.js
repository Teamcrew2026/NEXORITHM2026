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

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000; // 3 seconds between attempts

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Attempts to connect to MongoDB, retrying a few times with a short delay
 * in between. This protects against the brief connection blips that happen
 * on MongoDB Atlas free-tier (M0) clusters during routine maintenance /
 * automatic restarts, so a student's registration doesn't fail just
 * because the cluster happened to restart at that exact moment.
 */
const connectDB = async (attempt = 1) => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexorithm_2026';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Seed default admin if no admin accounts exist
    await seedDefaultAdmin();

    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] Attempt ${attempt}/${MAX_RETRIES}: ${error.message}`);

    if (attempt < MAX_RETRIES) {
      console.warn(`[MongoDB] Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await sleep(RETRY_DELAY_MS);
      return connectDB(attempt + 1);
    }

    console.error(`[MongoDB] All ${MAX_RETRIES} connection attempts failed.`);
    console.warn('[MongoDB Warning] Make sure your database username & password in .env are correct and Network Access is set to 0.0.0.0/0 in MongoDB Atlas.');
  }
};

// Log unexpected drops / recoveries after the initial connection succeeds
// (e.g. brief Atlas free-tier restarts). Mongoose's own driver handles the
// actual reconnect automatically; this just gives visibility in the logs.
mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Connection lost. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Reconnected successfully.');
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Connection error:', err.message);
});

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
