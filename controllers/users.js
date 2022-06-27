const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const User = require('../models/user');
// const { NotFoundError } = require('../error/NotFoundError');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

const OK_STATUS_CODE = 200;
const CREATED_STATUS_CODE = 201;
const CREATED_STATUS_MESSAGE = 'Успешный код состояния: создан';
const BAD_REQUEST_ERROR_CODE = 400;
const BAD_REQUEST_ERROR_MESSAGE = 'Переданы некорректные данные';
const UNAUTHORIZED_ERROR_CODE = 401;
const UNAUTHORIZED_ERROR_MESSAGE = 'Необходима авторизация';
const NOT_FOUND_ERROR_CODE = 404;
const NOT_FOUND_ERROR_MESSAGE = 'Карточка с указанным _id не найдена';
const CONFLICTING_REQ_ERR_CODE = 409;
const CONFLICTING_REQ_ERR_MESSAGE = 'Email уже занят';
const INTERNAL_SERVER_ERROR_CODE = 500;
const INTERNAL_SERVER_ERROR_MESSAGE = 'Произошла внутренняя ошибка сервера';

const app = express();
app.use(cookie());

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK_STATUS_CODE)
      .send({ data: users }))
    .catch(() => res.status(BAD_REQUEST_ERROR_CODE)
      .send({ message: BAD_REQUEST_ERROR_MESSAGE }));
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      return res.status(OK_STATUS_CODE)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR_CODE)
          .send({ message: BAD_REQUEST_ERROR_MESSAGE });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    return res.status(BAD_REQUEST_ERROR_CODE)
      .send({ message: BAD_REQUEST_ERROR_MESSAGE });
  }
  return bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      console.log(hash);
      return User.create({
        name, about, avatar, email, password: hash,
      });
    })
    .then((user) => res.status(CREATED_STATUS_CODE)
      .send({ data: user, message: CREATED_STATUS_MESSAGE }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR_CODE)
          .send({ message: BAD_REQUEST_ERROR_MESSAGE });
      }
      if (err.name === MONGO_DUPLICATE_ERROR_CODE) {
        return res.status(CONFLICTING_REQ_ERR_CODE)
          .send({ message: CONFLICTING_REQ_ERR_MESSAGE });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res.status(OK_STATUS_CODE)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR_CODE)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR_CODE)
          .send({ message: BAD_REQUEST_ERROR_MESSAGE });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFOund');
    })
    .then((user) => {
      res.status(OK_STATUS_CODE)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR_CODE)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR_CODE)
          .send({ message: BAD_REQUEST_ERROR_MESSAGE });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'magic-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 604800,
        httpOnly: true,
      });
      res.status(OK_STATUS_CODE).send({ token });
    })
    .catch(() => {
      res.status(UNAUTHORIZED_ERROR_CODE).send({ message: UNAUTHORIZED_ERROR_MESSAGE });
    });
};
