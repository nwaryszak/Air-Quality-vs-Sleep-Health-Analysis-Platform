const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); 
const {
  exportToJSON,
  exportToXML,
  importFromJSON,
  importFromXML,
} = require('../controllers/importExportController');

router.get('/export/json', auth, exportToJSON);
router.get('/export/xml', auth, exportToXML);
router.post('/import/json', auth, importFromJSON);
router.post('/import/xml', auth, importFromXML);

module.exports = router;
