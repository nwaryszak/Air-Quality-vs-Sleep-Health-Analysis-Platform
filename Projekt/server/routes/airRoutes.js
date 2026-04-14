const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

router.get('/:type', (req, res) => {
  const type = req.params.type.toLowerCase();

  const fileMap = {
    city: 'city.xml',
    village: 'village.xml',
  };

  const fileName = fileMap[type];
  if (!fileName) {
    return res.status(400).json({ error: 'Nieprawidłowy typ. Użyj "city" lub "village".' });
  }

  const filePath = path.join(__dirname, '..', fileName);

  fs.readFile(filePath, 'utf8', (err, xmlData) => {
    if (err) {
      console.error('Błąd wczytywania pliku XML:', err);
      return res.status(500).json({ error: 'Błąd wczytywania pliku XML' });
    }

    xml2js.parseString(xmlData, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('Błąd parsowania XML:', err);
        return res.status(500).json({ error: 'Błąd parsowania XML' });
      }

      let measurements = [];
      if (result.measurements && result.measurements.measurement) {
        if (Array.isArray(result.measurements.measurement)) {
          measurements = result.measurements.measurement.map(m => ({
            location_id: m.location_id,
            location_name: m.location_name,
            parameter: m.parameter,
            value: parseFloat(m.value),
            unit: m.unit,
            datetime: m.datetimeLocal,
          }));
        } else {
          const m = result.measurements.measurement;
          measurements.push({
            location_id: m.location_id,
            location_name: m.location_name,
            parameter: m.parameter,
            value: parseFloat(m.value),
            unit: m.unit,
            datetime: m.datetimeLocal,
          });
        }
      } else {
        return res.status(404).json({ error: 'Brak danych pomiarowych w pliku XML' });
      }

      res.json(measurements);
    });
  });
});

module.exports = router;
