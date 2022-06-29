const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// const BAD_REQUEST_ERROR_CODE = 400;
const BAD_REQUEST_ERROR_MESSAGE = 'Переданы некорректные данные';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'Жак-Ив кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isURL(v),
      message: () => 'Неверный формат ссылки на изображение',
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: () => 'Некорректый адрес почты',
    },
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(BAD_REQUEST_ERROR_MESSAGE));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(BAD_REQUEST_ERROR_MESSAGE));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
