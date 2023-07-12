const Transfers = require('../models/transfers.model');
const Users = require('../models/users.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.transfer = catchAsync(async (req, res, next) => {
  const { amount, senderUserId, receiverUserId } = req.body;

  if (senderUserId === receiverUserId) {
    return next(
      new AppError(
        `El ID del usuario remitente y el ID del usuario receptor no pueden ser iguales`,
        400
      )
    );
  }

  const receiverUser = await Users.findOne({
    where: {
      status: 'En linea 🐸',
      id: receiverUserId,
    },
  });

  if (!receiverUser) {
    return next(
      new AppError(`El usuario con ID:${receiverUserId} no es encontrado 😒`, 404)
    );
  }

  const senderUser = await Users.findOne({
    where: {
      status: 'En linea 🐸',
      id: senderUserId,
    },
  });

  if (!senderUser) {
    return next(
      new AppError(`El usuario con ID:${senderUserId} no es encontrado 😒`, 404)
    );
  }

  if (amount > senderUser.amount) {
    return next(
      new AppError(
        `El usuario con ID:${senderUserId} no tienes suficiente dinero para hacer la transferencia 💵`,
        400
      )
    );
  }

  await receiverUser.update({ amount: receiverUser.amount + amount });

  await senderUser.update({ amount: senderUser.amount - amount });

  await Transfers.create({
    amount,
    senderUserId,
    receiverUserId,
  });

  return res.status(200).json({
    status: 'De lujo',
    message: 'Tranferencia exitosa 🤑',
  });
});
