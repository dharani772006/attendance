const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentMobile: {
    type: String,
    required: true
  },
  facultyMobile: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: () => new Date().setHours(0,0,0,0) // store only date part
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  location: {
    lat: Number,
    lng: Number
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    default: 'Absent'
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);