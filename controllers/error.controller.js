const AppError = require('../src/utils/appError');
const logger = require('../src/utils/logger');

const handleCastError23505 = () =>
  new AppError('Valor duplicado: utilice otro valor 😒', 400);

const handleJWTExpiredError = () => {
  return new AppError('¡Tu token ha caducado¡ Inicie sesión de nuevo 😶‍🌫️', 401);
};

const handleJWTError = () => {
  return new AppError('Token Invalido. Inicie sesión de nuevo 📲', 401);
};

const sendErrorDev = (err, res) => {
  logger.info(err);
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  logger.info(err);

  //Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {

    //Programming or other unknown error: don't leak error detail
    return res.status(500).json({
      status: 'fallido',
      message: 'Algo salio mal!',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fallido';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = err;

    if (error.parent?.code === '23505') error = handleCastError23505();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (error.name === 'JsonWebTokenError') error = handleJWTError();

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
