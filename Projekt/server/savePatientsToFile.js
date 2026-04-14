const fs = require('fs');
const path = require('path');
const Patient = require('./models/Patient');  


const filePath = '/usr/src/app/Sleep_health_and_lifestyle_dataset.json';

async function savePatientsToFile() {
  try {
    
    const patients = await Patient.find();

    fs.writeFileSync(filePath, JSON.stringify(patients, null, 2), 'utf-8');

    console.log('Plik JSON został zaktualizowany:', filePath);
  } catch (error) {
    console.error('Błąd podczas zapisu do pliku JSON:', error);
  }
}

module.exports = savePatientsToFile;
