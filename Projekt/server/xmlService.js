
const fs = require('fs/promises');
const path = require('path');
const xml2js = require('xml2js');

const parser = new xml2js.Parser({ explicitArray: false });
const builder = new xml2js.Builder();

const files = {
  city: path.join(__dirname, 'city.xml'),  
  village: path.join(__dirname, 'village.xml') 
};

async function readXML(type) {
  if (!files[type]) throw new Error('Nieznany typ pliku XML');
  const xmlData = await fs.readFile(files[type], 'utf-8');
  const result = await parser.parseStringPromise(xmlData);
  let measurements = result.measurements.measurement || [];
  if (!Array.isArray(measurements)) {
    measurements = [measurements];
  }
  return measurements;
}

async function writeXML(type, measurements) {
  if (!files[type]) throw new Error('Nieznany typ pliku XML');
  const obj = { measurements: { measurement: measurements } };
  const xml = builder.buildObject(obj);
  await fs.writeFile(files[type], xml, 'utf-8');
}

module.exports = { readXML, writeXML };
