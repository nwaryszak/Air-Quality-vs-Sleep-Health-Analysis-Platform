// airQualityController.js
const { readXML, writeXML } = require('../xmlService');

exports.getMeasurements = async (req, res) => {
  const { type } = req.params;
  try {
    const measurements = await readXML(type);
    res.json(measurements);
  } catch (error) {
    console.error(' Błąd przy pobieraniu danych XML:', error);
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};


exports.addMeasurement = async (req, res) => {
  const { type } = req.params;
  const newMeasurement = req.body;

  try {
    const measurements = await readXML(type);
    measurements.push(newMeasurement);
    await writeXML(type, measurements);
    res.status(201).json(newMeasurement);
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.updateMeasurement = async (req, res) => {
  const { type, location_id } = req.params;
  const updatedMeasurement = req.body;

  try {
    let measurements = await readXML(type);
    const index = measurements.findIndex(m => m.location_id === location_id);
    if (index === -1) return res.status(404).json({ message: 'Pomiar nie znaleziony' });

    measurements[index] = updatedMeasurement;
    await writeXML(type, measurements);
    res.json(updatedMeasurement);
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.deleteMeasurement = async (req, res) => {
  const { type, location_id } = req.params;

  try {
    let measurements = await readXML(type);
    measurements = measurements.filter(m => m.location_id !== location_id);
    await writeXML(type, measurements);
    res.json({ message: 'Pomiar usunięty' });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};
