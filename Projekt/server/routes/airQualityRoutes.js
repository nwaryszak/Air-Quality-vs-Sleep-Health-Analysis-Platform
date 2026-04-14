// airQualityRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/airQualityController');

router.get('/air/:type', controller.getMeasurements);
router.post('/air/:type', controller.addMeasurement);
router.put('/air/:type/:location_id', controller.updateMeasurement);
router.delete('/air/:type/:location_id', controller.deleteMeasurement);

module.exports = router;
