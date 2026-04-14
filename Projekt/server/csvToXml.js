const fs = require('fs');
const csv = require('csv-parser');
const { Builder } = require('xml2js');

// Dodaj nowe pliki do listy
const files = ['city.csv', 'village.csv', 'city1.csv', 'village1.csv'];

function csvToXml(inputFile, outputFile) {
  const results = [];

  fs.createReadStream(inputFile)
    .pipe(csv())
    .on('data', (row) => {
      if (!row.location_id || row.location_id === 'location_id') return;

      const cleanedRow = {
        location_id: row.location_id,
        location_name: row.location_name,
        parameter: row.parameter,
        value: row.value ? parseFloat(row.value) : null,
        unit: row.unit,
        datetimeUtc: row.datetimeUtc,
        datetimeLocal: row.datetimeLocal,
        timezone: row.timezone,
        latitude: row.latitude ? parseFloat(row.latitude) : null,
        longitude: row.longitude ? parseFloat(row.longitude) : null,
        country_iso: row.country_iso || null,
        isMobile: row.isMobile || null,
        isMonitor: row.isMonitor || null,
        owner_name: row.owner_name,
        provider: row.provider
      };

      results.push(cleanedRow);
    })
    .on('end', () => {
      const builder = new Builder({
        rootName: 'measurements',
        xmldec: { version: '1.0', encoding: 'UTF-8' }
      });

      const xml = builder.buildObject({ measurement: results });

      fs.writeFileSync(outputFile, xml, 'utf-8');
      console.log(`✅ Zapisano plik: ${outputFile}`);
    });
}

// Przetwarzanie wszystkich plików CSV na XML
files.forEach((file) => {
  const outputFile = file.replace('.csv', '.xml');
  csvToXml(file, outputFile);
});
