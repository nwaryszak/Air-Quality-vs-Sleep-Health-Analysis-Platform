const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const client = require('prom-client'); 
const Prometheus = require('prom-client');

const register = new Prometheus.Registry();
register.setDefaultLabels({
  app: 'server'
});
Prometheus.collectDefaultMetrics({ register });

// Połączenie z bazą danych
const connectDB = require('./config/db');
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.text({ type: 'application/xml' }));



app.use('/api', require('./routes/airQualityRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients/import-export', require('./routes/patients'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/air', require('./routes/airRoutes')); 
app.use('/api/analysis', require('./routes/analysisRoutes'));

app.get('/metrics', async (req, res) => {
  try {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});
// Endpoint do JSON z pacjentami
app.get('/api/data/patients', (req, res) => {
  const filePath = path.join(__dirname, 'Sleep_health_and_lifestyle_dataset.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Błąd odczytu JSON:', err);
      return res.status(500).json({ error: 'Nie udało się wczytać danych' });
    }
    try {
      const parsed = JSON.parse(data);
      res.json(parsed);
    } catch (parseErr) {
      console.error('Błąd parsowania JSON:', parseErr);
      res.status(500).json({ error: 'Błąd parsowania JSON' });
    }
  });
});

app.get('/api/air/:type', (req, res) => {
  const type = req.params.type.toLowerCase();

  const fileMap = {
    city: 'city.xml',
    village: 'village.xml',
  };

  const fileName = fileMap[type];
  if (!fileName) {
    return res.status(400).json({ error: 'Nieprawidłowy typ. Użyj "city" lub "village".' });
  }

  const filePath = path.join(__dirname, fileName);

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
        const rawMeasurements = Array.isArray(result.measurements.measurement)
          ? result.measurements.measurement
          : [result.measurements.measurement];

        measurements = rawMeasurements.map(m => {
          let valStr = m.value;
          if (typeof valStr === 'string') {
            valStr = valStr.replace(',', '.');
          }
          const valNum = parseFloat(valStr);

          return {
            location_id: m.location_id,
            location_name: m.location_name,
            parameter: m.parameter,
            value: isNaN(valNum) ? 0 : valNum,
            unit: m.unit,
            datetime: m.datetimeLocal,
          };
        });
      } else {
        return res.status(404).json({ error: 'Brak danych pomiarowych w pliku XML' });
      }

      res.json(measurements);
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log( `Server running on port ${PORT}`));