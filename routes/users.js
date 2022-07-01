const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, updateProfile, updateAvatar, createUser, findUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.get('/me', findUser);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().alphanum().min(2)
      .max(30),
    about: Joi.string().required().alphanum().min(2)
      .max(30),
    password: Joi.string().required().min(8).uri(),
  }),
}), createUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().alphanum().min(2)
      .max(30),
    about: Joi.string().required().alphanum().min(2)
      .max(30),
    avatar: Joi.string().required().uri(),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  }),
}), updateAvatar);

module.exports = router;
