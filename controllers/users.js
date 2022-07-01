const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const User = require('../models/user');

const BAD_REQUEST_ERROR_MESSAGE = 'Переданы некорректные данные';
const UNAUTHORIZED_ERROR_MESSAGE = 'Необходима авторизация';
const NOT_FOUND_ERROR_MESSAGE = 'Карточка с указанным _id не найдена';
const CONFLICTING_REQ_ERR_MESSAGE = 'Email уже занят';
const INTERNAL_SERVER_ERROR_MESSAGE = 'Произошла внутренняя ошибка сервера';

const app = express();
app.use(cookie());

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200)
      .send({ data: users }))
    .catch(() => res.status(400)
      .send({ message: BAD_REQUEST_ERROR_MESSAGE }));
};

module.exports.getUser = (req, res) => {
  User.findOne(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      return res.status(200)
        .send({ data: user });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      return res.status(200)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400)
          .send({ message: BAD_REQUEST_ERROR_MESSAGE });
      }
      return res.status(500)
        .send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    return res.status(400)
      .send({ message: BAD_REQUEST_ERROR_MESSAGE });
  }
  return bcrypt.hash(password, 10)
    .then((hash) => {
      console.log(hash);
      return User.create({
        name, about, avatar, email, password,
      });
    })
    .then((user) => res.status(201)
      .send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400)
          .send({ message: BAD_REQUEST_ERROR_MESSAGE });
      }
      if (err.code === 11000) {
        return res.status(409)
          .send({ message: CONFLICTING_REQ_ERR_MESSAGE });
      }
      return res.status(500)
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
      res.status(200)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      if (err.name === 'ValidationError') {
        return res.status(400)
          .send({ message: BAD_REQUEST_ERROR_MESSAGE });
      }
      return res.status(500)
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
      res.status(200)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      if (err.name === 'ValidationError') {
        return res.status(400)
          .send({ message: BAD_REQUEST_ERROR_MESSAGE });
      }
      return res.status(500)
        .send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user);
      const token = jwt.sign({ _id: user._id }, 'magic-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      res.status(401).send({ message: UNAUTHORIZED_ERROR_MESSAGE });
    });
};

// module.exports.login = (req, res) => {
//   const { email, password } = req.body;
//   User.findOne({ email })
//     .select('+password')
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(new Error(BAD_REQUEST_ERROR_MESSAGE));
//       }
//       return bcrypt.compare(password, user.password);
//     })
//     .then((matched) => {
//       if (!matched) {
//         return Promise.reject(new Error(BAD_REQUEST_ERROR_MESSAGE));
//       }
//       return res.send({ message: OK_STATUS_MESSAGE });
//     })
//     .catch(() => {
//       res.status(401)
//         .send({ message: UNAUTHORIZED_ERROR_MESSAGE });
//     });
// };
