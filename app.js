require('dotenv').config();

const Server = require('./models/Server');

const server = new Server();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

//GESTOR DE ERRORES ---
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');

//ROUTERS ---
const usersRouter = require('./routes/users.routes');
const transfersRouter = require('./routes/transfers.routes');

//INICIALIZACION DE APP ---
const app = express();

//MIDDLEWARES
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//ROUTERS ---
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/transfers', transfersRouter);

//ERRORES ---
app.all('*', (req, res, next) => {
  return next(
    new AppError(`No puedo encontrar ${req.originalUrl} en este servidor!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
