const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');

const User = require('../models/users');

const app = express();
app.use(cookie());

const userDataErrorMessage = 'Переданы некорректные данные'; /* ошибка 400 */
const userIdErrorMessage = 'Пользователь по указанному _id не найден'; /* ошибка 404 */
const defaultErrorMessage = 'Произошлав внутренняя ошибка сервера'; /* ошибка 500 */

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: defaultErrorMessage }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: userIdErrorMessage });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: userDataErrorMessage });
      } else {
        res.status(500).send({ message: userDataErrorMessage });
      }
      // next(err);
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (password.length < 8) {
    return res.status(400).send({ message: 'Длина пароля должна быть не менее 8 символов' });
  }
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.send({ /* .then((user) */
      name, about, avatar, email, /* { data: user } */
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: userDataErrorMessage });
        return;
      }
      if (err.name === 'MongoError' || err.code === 11000) {
        res.status(409).send({ message: 'Указанный email уже занят' });
      } else res.status(500).send({ message: defaultErrorMessage });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: userDataErrorMessage });
      } else res.status(500).send({ message: defaultErrorMessage });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => (res.send({ data: user })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: userDataErrorMessage });
      } else res.status(500).send({ message: defaultErrorMessage });
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
      res.status(200).send({ token });
    })
    .catch((err) => {
      res.status(200).send({ message: err.message });
    });
};
