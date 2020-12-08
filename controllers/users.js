require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name = 'User', email, password,
  } = req.body;

  if (!(email && password)) {
    return next(new IncorrectDataError('Поля email и password должны быть заполнены!'));
  }

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then(() => res.send({ data: 'Вы успешно зарегистрировались' }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectDataError('Переданны некорректные данные');
      } else if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован');
      }
      throw err;
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return next(new IncorrectDataError('Поля email и password должны быть заполнены!'));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(() => next(new UnauthorizedError('Неверный email или пароль')))
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      if (err.name === 'CastError') {
        throw new IncorrectDataError('Некорректный Id пользователя');
      }
      throw err;
    })
    .catch(next);
};

module.exports = {
  createUser, login, getUserInfo,
};
