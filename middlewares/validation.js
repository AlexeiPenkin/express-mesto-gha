const { celebrate, Joi } = require('celebrate');
const isURL = require('validator');
const RegExp = require('../models/user');

module.exports.findUserValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
});

module.exports.getUserByIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
});

module.exports.createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, error) => {
      if (RegExp(value)) {
        return value;
      }
      return error.message('Некорректный формат ссылки');
    }),
    email: Joi.string().required(),
    password: Joi.string().required().min(6),
  }),
});

module.exports.updateProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom((value, error) => {
      if (RegExp(value)) {
        return value;
      }
      return error.message('Некорректный формат ссылки');
    }),
  }),
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom((value, error) => {
      if (isURL(value)) {
        return value;
      }
      return error.message('Некорректный формат ссылки');
    }),
  }),
});

module.exports.deleteCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});

module.exports.likeCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});

module.exports.dislikeCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});
