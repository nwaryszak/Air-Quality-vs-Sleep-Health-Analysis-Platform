const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString()
  },
  PersonID: Number,
  'First Name': String,
  'Last Name': String,
  Gender: String,
  Age: Number,
  Occupation: String,
  'Sleep Duration': Number,
  'Quality of Sleep': Number,
  'Physical Activity Level': Number,
  'Stress Level': Number,
  'BMI Category': String,
  'Blood Pressure': String,
  HeartRate: Number,
  DailySteps: Number,
  SleepDisorder: String,
  Location: String,
  LocationDetails: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model('Patient', patientSchema, 'pacjenci');
