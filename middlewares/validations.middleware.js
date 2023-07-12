const { body, validationResult } = require('express-validator');

const validFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }

  next();
};

exports.createUserValidation = [
  body('name').notEmpty().withMessage('Nombre no puede estar vacio'),
  body('password')
    .notEmpty()
    .withMessage('Contraseña no puede estar vacia')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe contener como minimo 8 caracteres'),
  validFields,
];

exports.loginUserValidation = [
  body('accountNumber')
    .notEmpty()
    .withMessage('Numero de cuenta no puede estar vacio')
    .isLength({ min: 6, max: 6 })
    .withMessage('Numero de cuenta debe tener como minimo 6 digitos'),
  body('password')
    .notEmpty()
    .withMessage('Contraseña no puede estar vacia')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe contener como minimo 8 caracteres'),
  validFields,
];

exports.transferValidation = [
  body('amount')
    .notEmpty()
    .withMessage('Monto no puede estar vacia')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero positivo'),
  body('senderUserId')
    .notEmpty()
    .withMessage('El ID de usuario no puede estar vacío')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero positivo'),
  body('receiverUserId')
    .notEmpty()
    .withMessage('El ID de usuario no puede estar vacío')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero positivo'),
  validFields,
];
