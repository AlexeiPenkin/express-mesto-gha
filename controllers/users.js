const User = require('../models/users');
// const { NotFoundError } = require('../error/NotFoundError');

const userDataErrorMessage = 'Переданы некорректные данные'; /* ошибка 400 */
// const userIdErrorMessage = 'Пользователь по указанному _id не найден'; /* ошибка 404 */
const defaultErrorMessage = 'Произошлав внутренняя ошибка сервера'; /* ошибка 500 */

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: defaultErrorMessage }));
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: userDataErrorMessage });
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
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: userDataErrorMessage });
      } else res.status(500).send({ message: defaultErrorMessage });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
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
