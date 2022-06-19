const User = require('../models/users');
const { NotFoundError } = require('../error/NotFoundError');

const userIdErrorMessage = 'Пользователь по указанному _id не найден'; /* ошибка 404 */
const defaultErrorMessage = 'Произошлав внутренняя ошибка сервера'; /* ошибка 500 */

module.exports.getUsers = (req, res) => {
  // console.log(req.user._id);
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: defaultErrorMessage }));
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => {
      if (user) res.status(200).send({ data: user });
      else {
        res.status(404).send({ message: userIdErrorMessage });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: userIdErrorMessage });
      } else if (err.name === NotFoundError()) {
        res.status(404).send({ message: userIdErrorMessage });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      else res.status(500).send({ message: defaultErrorMessage });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      if (err.name === NotFoundError()) {
        res.status(404).send({ message: userIdErrorMessage });
      }
      return res.status(500).send({ message: defaultErrorMessage });
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  })
    .then((user) => (res.send({ data: user })))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      else res.status(500).send({ message: defaultErrorMessage });
    });
};
