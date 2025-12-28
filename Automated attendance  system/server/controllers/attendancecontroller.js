const Attendance = require('../models/attendance');
const isWithinGeofence = require('../utils/geofence');

exports.checkin = async (req, res) => {
  const { facultyMobile, studentMobile, location } = req.body;

  // Campus coordinates
  const campusLat = 12.89;
  const campusLng = 79.87;
  const radius = 100; // meters

  // Time window: 7:30–9:00 AM
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = 7 * 60 + 30;
  const endMinutes = 9 * 60;

  if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
    return res.status(403).json({ message: 'Check-in only allowed between 7:30 and 9:00 AM.' });
  }

  if (!isWithinGeofence(location.lat, location.lng, campusLat, campusLng, radius)) {
    return res.status(403).json({ message: 'Outside campus geofence. Attendance denied.' });
  }

  const today = new Date(); today.setHours(0,0,0,0);

  const record = await Attendance.findOneAndUpdate(
    { facultyMobile, studentMobile, date: today },
    { checkInTime: new Date(), location, status: 'Present' },
    { upsert: true, new: true }
  );

  res.json({ message: 'Attendance marked present', record });
};
exports.checkout = async (req, res) => {
  const { facultyMobile, studentMobile } = req.body;

  // Time window: 3:00–4:00 PM
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = 15 * 60; // 3:00 PM
  const endMinutes = 16 * 60;   // 4:00 PM

  if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
    return res.status(403).json({ message: 'Checkout only allowed between 3:00 and 4:00 PM.' });
  }

  const today = new Date(); today.setHours(0,0,0,0);

  const record = await Attendance.findOneAndUpdate(
    { facultyMobile, studentMobile, date: today },
    { checkOutTime: new Date() },
    { new: true }
  );

  if (!record) {
    return res.status(404).json({ message: 'No check-in record found for today.' });
  }

  res.json({ message: 'Checkout recorded successfully', record });
};