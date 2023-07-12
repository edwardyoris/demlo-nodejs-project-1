const Users = require('../models/users.model');
const Transfers = require('../models/transfers.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, password } = req.body;

  const accountNumber = Math.floor(Math.random() * 900000) + 100000;

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await Users.create({
    name: name.toLowerCase(),
    accountNumber,
    password: encryptedPassword,
  });

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'De Lujo',
    message: 'Felicidades eres nuestro nuevo BankAcar 🥳',
    token,
    user: {
      id: user.id,
      name: user.name,
      accountNumber: user.accountNumber,
      amount: user.amount,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { accountNumber, password } = req.body;

  const user = await Users.findOne({
    where: {
      accountNumber,
      status: 'De Lujo',
    },
  });

  if (!user) {
    return next(
      new AppError(
        `EL usuario con el numero de cuenta:${accountNumber} no ha sido encontrado 🔎`,
        404
      )
    );
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError(`Número de cuenta o contraseña incorrectos 🚫`, 401));
  }

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'De Lujo',
    token,
    user: {
      id: user.id,
      name: user.name,
      accountNumber: user.accountNumber,
      amount: user.amount,
    },
  });
});

exports.findHistory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await Users.findOne({
    where: {
      id,
      status: 'En linea 🐸',
    },
  });

  if (!user) {
    return next(new AppError(`El usuario con ID:${id} no ha sido encontrado 🔎`, 404));
  }

  const transfersById = await Transfers.findAll({
    where: {
      senderUserId: id,
    },
  });

  if (!transfersById) {
    return next(new AppError(`El usuario con ID:${id} no ha hecho transferencias 😪`, 404));
  }

  res.status(200).json({
    status: 'De Lujo',
    user: {
      id: user.id,
      name: user.name,
      accountNumber: user.accountNumber,
    },
    tranfersDone: transfersById.length,
    transfersById,
  });
});
