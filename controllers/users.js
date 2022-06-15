const User = require('../models/users');
const mongoose = require('mongoose');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) =>
      res.send({ data: users }))
    .catch((err) =>
      res.status(500).send({message: `Произошла ошибка ${err}`}));
};

module.exports.getUsersById = (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.userId)) {
    User.findById(req.params.userId)
      .then((user) => {
        if (user) res.status(200)
          .send({ data: user });
        else {
          res.status(404).send({ message: 'Нет пользователя с таким id' });
        }
      })
      .catch((err) => res.status(500)
        .send({ message: `Произошла ошибка ${err}` }));
  } else {
    res.status(404).send({ message: 'Нет пользователя с таким id' });
  }
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
    User.create({ name, about, avatar })
      .then(user =>
        res.send({ data: user }))
      .catch(err => res.status(500)
        .send({ message: 'Произошла ошибка' }));
};
