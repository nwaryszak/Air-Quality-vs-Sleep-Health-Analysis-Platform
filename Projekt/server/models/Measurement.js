const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  location_id: String,
  location_name: String,
  parameter: String,
  value: Number,
  unit: String,
  datetimeUtc: String,
  datetimeLocal: String,
  timezone: String,
  latitude: Number,
  longitude: Number,
  country_iso: String,
  isMobile: String,
  isMonitor: String,
  owner_name: String,
  provider: String
});

module.exports = mongoose.model('Measurement', measurementSchema);
