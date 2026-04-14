const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');

//Pomocnicza funkcja do odczytu wartości z XML
const getAverageFromXml = async (filePath) => {
  const xml = fs.readFileSync(filePath, 'utf8');
  const parsed = await parseStringPromise(xml);

  let measurements = parsed?.measurements?.measurement || [];

  if (!Array.isArray(measurements)) {
    measurements = [measurements];
  }

  const values = measurements
    .map(m => parseFloat(m.value?.[0]))
    .filter(v => !isNaN(v));

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return parseFloat(avg.toFixed(2));
};

//wczytaj dane pacjentów z pliku JSON
const loadPatientsFromFile = () => {
  const filePath = path.join(__dirname, '../Sleep_health_and_lifestyle_dataset.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
};

// /analysis/sleep-vs-air
router.get('/sleep-vs-air', async (req, res) => {
  try {
    const patients = loadPatientsFromFile();

    const villageVal = await getAverageFromXml(path.join(__dirname, '../village.xml'));
    const cityVal = await getAverageFromXml(path.join(__dirname, '../city.xml'));

    const villagePatients = patients.filter(p => p.Location?.toLowerCase() === 'village');
    const cityPatients = patients.filter(p => p.Location?.toLowerCase() === 'city');

    const avgSleep = arr => arr.length ? arr.reduce((acc, p) => acc + (p['Quality of Sleep'] || 0), 0) / arr.length : 0;

    const result = [
      {
        location: 'village',
        avgSleepQuality: avgSleep(villagePatients),
        airPollution: villageVal,
      },
      {
        location: 'city',
        avgSleepQuality: avgSleep(cityPatients),
        airPollution: cityVal,
      },
    ];

    res.json(result);
  } catch (err) {
    console.error('Błąd sleep-vs-air:', err);
    res.status(500).json({ error: 'Błąd sleep-vs-air' });
  }
});

// /analysis/stress-vs-air
router.get('/stress-vs-air', async (req, res) => {
  try {
    const patients = loadPatientsFromFile();

    const villageVal = await getAverageFromXml(path.join(__dirname, '../village.xml'));
    const cityVal = await getAverageFromXml(path.join(__dirname, '../city.xml'));

    const villagePatients = patients.filter(p => p.Location?.toLowerCase() === 'village');
    const cityPatients = patients.filter(p => p.Location?.toLowerCase() === 'city');

    const avgStress = arr => arr.length ? arr.reduce((acc, p) => acc + (p['Stress Level'] || 0), 0) / arr.length : 0;

    const result = [
      {
        location: 'village',
        avgStressLevel: avgStress(villagePatients),
        airPollution: villageVal,
      },
      {
        location: 'city',
        avgStressLevel: avgStress(cityPatients),
        airPollution: cityVal,
      },
    ];

    res.json(result);
  } catch (err) {
    console.error('Błąd stress-vs-air:', err);
    res.status(500).json({ error: 'Błąd stress-vs-air' });
  }
});

// /analysis/heart-vs-air
router.get('/heart-vs-air', async (req, res) => {
  try {
    const patients = loadPatientsFromFile();

    const villageVal = await getAverageFromXml(path.join(__dirname, '../village.xml'));
    const cityVal = await getAverageFromXml(path.join(__dirname, '../city.xml'));

    const villagePatients = patients.filter(p => p.Location?.toLowerCase() === 'village');
    const cityPatients = patients.filter(p => p.Location?.toLowerCase() === 'city');

    const avgHeart = arr => arr.length ? arr.reduce((acc, p) => acc + (p['HeartRate'] || 0), 0) / arr.length : 0;

    const result = [
      {
        location: 'village',
        avgHeartRate: avgHeart(villagePatients),
        airPollution: villageVal,
      },
      {
        location: 'city',
        avgHeartRate: avgHeart(cityPatients),
        airPollution: cityVal,
      },
    ];

    res.json(result);
  } catch (err) {
    console.error('Błąd heart-vs-air:', err);
    res.status(500).json({ error: 'Błąd heart-vs-air' });
  }
});

module.exports = router;
