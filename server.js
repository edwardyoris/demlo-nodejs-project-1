require('dotenv').config();
const app = require('./src/app');
const { db } = require('./database/db');

db.authenticate()
  .then(() => console.log('Autenticación de base de datos'))
  .catch((err) => console.log(err));

db.sync()
  .then(() => console.log('Base de datos sincronizada'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}! 🤩`);
});
