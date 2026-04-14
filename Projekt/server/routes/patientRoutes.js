const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Patient = require('../models/Patient');
const { updatePatient, deletePatient, getAllPatients, getPatientById } = require('../controllers/patientController');
const { exportToJSON, importFromJSON, exportToXML, importFromXML } = require('../controllers/importExportController');

router.post('/', auth, async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Błąd serwera przy dodawaniu pacjenta' });
  }
});
// Lista pacjentów (GET)
router.get('/', auth, getAllPatients);

// Pobierz pacjenta po ID (GET)
router.get('/:id', auth, getPatientById);

// Edytuj pacjenta (PUT)
router.put('/:id', auth, updatePatient);

// Usuń pacjenta (DELETE)
router.delete('/:id', auth, deletePatient);

// Eksport JSON
router.get('/export/json', auth, exportToJSON);

// Import JSON
router.post('/import/json', auth, importFromJSON);

// Eksport XML
router.get('/export/xml', auth, exportToXML);

// Import XML
router.post('/import/xml', auth, importFromXML);

module.exports = router;
