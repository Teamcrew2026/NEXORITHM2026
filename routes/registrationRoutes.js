const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const Registration = require('../models/Registration');
const { requireAdminAuth } = require('../middleware/auth');

// Configure Cloudinary (permanent image hosting for payment screenshots)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * @route   POST /api/registration
 * @desc    Submit a new student delegate registration (Public)
 */
router.post('/', async (req, res) => {
  try {
    const {
      id: customId,
      fullName,
      name,
      college,
      dept,
      department,
      year,
      email,
      phone,
      events,
      teamSize,
      teamMembers,
      amount,
      foodPreference,
      paymentMethod,
      transactionId,
      utr,
      screenshot,
      paymentVerified,
      isSpot
    } = req.body;

    const actualName = (fullName || name || '').trim();
    const actualCollege = (college || '').trim();
    const actualDept = (dept || department || 'CSE').trim();
    const actualYear = (year || 'Delegate').trim();
    const actualEmail = (email || '').trim();
    const actualPhone = (phone || '').trim();
    const actualUtr = (transactionId || utr || '').trim();
    const actualAmount = parseFloat(amount) || 250.00;

    // Validation
    if (!actualName) {
      return res.status(400).json({ success: false, message: 'Full Name is required.' });
    }
    if (!actualCollege) {
      return res.status(400).json({ success: false, message: 'College name is required.' });
    }
    if (!actualEmail || !actualEmail.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email is required.' });
    }
    if (!actualPhone) {
      return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }
    if (!actualUtr) {
      return res.status(400).json({ success: false, message: 'UPI Reference / Transaction UTR is required.' });
    }

    let actualEvents = [];
    if (Array.isArray(events)) {
      actualEvents = events;
    } else if (typeof events === 'string') {
      try {
        const parsed = JSON.parse(events);
        actualEvents = Array.isArray(parsed) ? parsed : [events];
      } catch (e) {
        actualEvents = events.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    if (actualEvents.length === 0) {
      return res.status(400).json({ success: false, message: 'Event selection is required.' });
    }

    // Process Screenshot — upload to Cloudinary (permanent hosted URL)
    let screenshotPath = screenshot || '';
    if (typeof screenshot === 'string' && screenshot.startsWith('data:image/')) {
      try {
        const uploadResult = await cloudinary.uploader.upload(screenshot, {
          folder: 'nexorithm_2026_payments',
          resource_type: 'image'
        });
        screenshotPath = uploadResult.secure_url;
      } catch (uploadErr) {
        console.warn('[Cloudinary Upload Warning]', uploadErr.message);
        // Don't fall back to storing raw base64 in MongoDB — leave empty instead
        screenshotPath = '';
      }
    }

    const regId = customId || (isSpot ? `NX-SPOT-${Math.floor(1000 + Math.random() * 9000)}` : `NX-${Math.floor(1000 + Math.random() * 9000)}`);

    // Upsert registration in MongoDB
    const registrationData = {
      id: regId,
      fullName: actualName,
      college: actualCollege,
      dept: actualDept,
      year: actualYear,
      email: actualEmail,
      phone: actualPhone,
      events: actualEvents,
      teamSize: parseInt(teamSize) || 1,
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [actualName],
      amount: actualAmount,
      foodPreference: foodPreference || 'Vegetarian',
      paymentMethod: paymentMethod || 'UPI / GPay',
      transactionId: actualUtr,
      screenshot: screenshotPath,
      paymentVerified: paymentVerified !== undefined ? Boolean(paymentVerified) : true
    };

    const saved = await Registration.findOneAndUpdate(
      { id: regId },
      { $set: registrationData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successfully saved to MongoDB database.',
      data: {
        ...saved.toJSON(),
        timestamp: saved.createdAt
      }
    });

  } catch (error) {
    console.error('[Registration POST Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Database error: ' + error.message
    });
  }
});

/**
 * @route   GET /api/registration
 * @desc    Retrieve all registrations with search, filter, and analytics stats (Admin only)
 */
router.get('/', requireAdminAuth, async (req, res) => {
  try {
    const { search = '', event = 'all', college = 'all' } = req.query;

    const query = {};

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { id: { $regex: s, $options: 'i' } },
        { fullName: { $regex: s, $options: 'i' } },
        { email: { $regex: s, $options: 'i' } },
        { phone: { $regex: s, $options: 'i' } },
        { college: { $regex: s, $options: 'i' } },
        { dept: { $regex: s, $options: 'i' } },
        { transactionId: { $regex: s, $options: 'i' } }
      ];
    }

    if (college && college !== 'all') {
      query.college = college;
    }

    if (event && event !== 'all') {
      query.events = event;
    }

    const rows = await Registration.find(query).sort({ createdAt: -1 });

    // Distinct list of colleges
    const allCollegesList = await Registration.distinct('college');

    // Aggregate statistics
    let totalRevenue = 0;
    const distinctCollegesSet = new Set();

    const formattedData = rows.map(doc => {
      const item = doc.toJSON();
      totalRevenue += item.amount || 0;
      if (item.college) distinctCollegesSet.add(item.college);
      return {
        ...item,
        timestamp: doc.createdAt
      };
    });

    return res.json({
      success: true,
      count: formattedData.length,
      stats: {
        totalDelegates: formattedData.length,
        totalRevenue,
        distinctColleges: distinctCollegesSet.size,
        allCollegesList: allCollegesList.filter(Boolean).sort()
      },
      data: formattedData
    });

  } catch (error) {
    console.error('[Registration GET Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Database query failed: ' + error.message
    });
  }
});

/**
 * @route   POST /api/registration/status
 * @desc    Toggle or update payment verification status (Admin only)
 */
router.post('/status', requireAdminAuth, async (req, res) => {
  try {
    const { id, paymentVerified } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Registration ID is required.' });
    }

    const record = await Registration.findOne({ id });
    if (!record) {
      return res.status(404).json({ success: false, message: `Registration ${id} not found.` });
    }

    const newStatus = paymentVerified !== undefined ? Boolean(paymentVerified) : !record.paymentVerified;
    record.paymentVerified = newStatus;
    await record.save();

    return res.json({
      success: true,
      message: `Payment verification status updated for ${record.fullName}`,
      id: record.id,
      paymentVerified: newStatus
    });
  } catch (error) {
    console.error('[Status Update Error]', error);
    return res.status(500).json({ success: false, message: 'Database error: ' + error.message });
  }
});

/**
 * @route   POST /api/registration/delete
 * @desc    Delete a registration record (Admin only)
 */
router.post('/delete', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Registration ID is required.' });
    }

    const record = await Registration.findOne({ id });
    if (!record) {
      return res.status(404).json({ success: false, message: `Registration ${id} not found.` });
    }

    // Note: screenshot images are now hosted on Cloudinary (not local disk),
    // so no local file cleanup is needed here.

    await Registration.deleteOne({ id });

    return res.json({
      success: true,
      message: `Registration ${id} permanently deleted.`
    });
  } catch (error) {
    console.error('[Delete Error]', error);
    return res.status(500).json({ success: false, message: 'Database error: ' + error.message });
  }
});

module.exports = router;
