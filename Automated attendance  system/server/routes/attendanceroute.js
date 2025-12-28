const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');

// Get attendance by student mobile
router.get('/student/:mobile', async (req, res) => {
  try {
    const records = await Attendance.find({ studentMobile: req.params.mobile });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance records' });
  }
});

module.exports = router;
