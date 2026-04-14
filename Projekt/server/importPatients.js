require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const xml2js = require('xml2js');
const Patient = require('./models/Patient');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

async function parseXML(filePath) {
  const xmlData = fs.readFileSync(filePath, 'utf-8');
  return await xml2js.parseStringPromise(xmlData);
}

function mapPatient(patient) {
  return {
    "Person ID": patient["Person ID"],
    "First Name": patient["First Name"],
    "Last Name": patient["Last Name"],
    Gender: patient.Gender,
    Age: patient.Age,
    Occupation: patient.Occupation,
    "Sleep Duration": patient["Sleep Duration"],
    "Quality of Sleep": patient["Quality of Sleep"],
    "Physical Activity Level": patient["Physical Activity Level"],
    "Stress Level": patient["Stress Level"],
    "BMI Category": patient["BMI Category"],
    "Blood Pressure": patient["Blood Pressure"],
    "Heart Rate": patient["Heart Rate"],
    "Daily Steps": patient["Daily Steps"],
    "Sleep Disorder": patient["Sleep Disorder"],
    Location: patient.Location
  };
}


async function importPatients() {
  try {
    const patientsData = JSON.parse(fs.readFileSync('./Sleep_health_and_lifestyle_dataset.json', 'utf-8'));

    const cities = await parseXML('./city.xml');
    const villages = await parseXML('./village.xml');

    const citiesData = cities?.cities?.city || [];
    const villagesData = villages?.villages?.village || [];

    const mappedPatients = patientsData.map(patient => {
      const basePatient = mapPatient(patient);

      if (patient.Location === 'city') {
        basePatient.LocationDetails = citiesData;
      } else if (patient.Location === 'village') {
        basePatient.LocationDetails = villagesData;
      }

      return basePatient;
    });

    console.log('Przykładowy pacjent z mapowaniem:', mappedPatients[0]);

    await Patient.insertMany(mappedPatients);

    console.log('Pacjenci z dodatkowymi danymi lokalizacji zapisani do bazy!');
  } catch (err) {
    console.error('Błąd podczas importu:', err);
  } finally {
    mongoose.connection.close();
  }
}

importPatients();