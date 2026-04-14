const mongoose = require('mongoose');
const Patient = require('./models/Patient');

mongoose.connect('mongodb+srv://student:azGtREYfjShksZn3@projekt.ejp7dur.mongodb.net/Projekt?retryWrites=true&w=majority&appName=Projekt', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Połączono z MongoDB');

    const result = await Patient.deleteMany({});
    console.log(`Usunięto ${result.deletedCount} dokumentów`);

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Błąd połączenia z MongoDB:', err);
  });
