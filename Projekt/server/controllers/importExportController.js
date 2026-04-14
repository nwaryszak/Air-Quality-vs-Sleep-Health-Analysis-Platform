const fs = require('fs');
const { parseStringPromise, Builder } = require('xml2js');
const Patient = require('../models/Patient');
const Measurement = require('../models/Measurement');

// Eksport do JSON (pacjenci)
exports.exportToJSON = async (req, res) => {
  try {
    const patients = await Patient.find();
    fs.writeFileSync('patients.json', JSON.stringify(patients, null, 2), 'utf-8');
    res.download('patients.json');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd eksportu JSON' });
  }
};

// Eksport do XML (pacjenci)
exports.exportToXML = async (req, res) => {
  try {
    const patients = await Patient.find();
    const builder = new Builder({
      rootName: 'patients',
      xmldec: { version: '1.0', encoding: 'UTF-8' },
    });
    const xmlObj = { patient: patients.map(p => p.toObject()) };
    const xml = builder.buildObject(xmlObj);
    fs.writeFileSync('patients.xml', xml, 'utf-8');
    res.download('patients.xml');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd eksportu XML' });
  }
};

// Import z JSON (pacjenci)
exports.importFromJSON = async (req, res) => {
  try {
    const patients = req.body;
    if (!Array.isArray(patients)) {
      return res.status(400).json({ message: 'Dane muszą być tablicą pacjentów' });
    }
    await Patient.insertMany(patients);
    res.json({ message: 'Import JSON zakończony', count: patients.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd importu JSON' });
  }
};

// Import z XML (pacjenci)
exports.importFromXML = async (req, res) => {
  try {
    const rawXml = req.body; // XML jako tekst
    const result = await parseStringPromise(rawXml);

    const patients = result?.patients?.patient;
    if (!patients || patients.length === 0) {
      return res.status(400).json({ message: 'Brak danych w pliku XML' });
    }

    // Konwertujemy XML do prostszych obiektów
    const parsedPatients = patients.map(item => {
      const obj = {};
      for (const key in item) {
        obj[key] = item[key][0];
      }
      return obj;
    });

    await Patient.insertMany(parsedPatients);
    res.json({ message: 'Import XML zakończony', count: parsedPatients.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd importu XML' });
  }
};
