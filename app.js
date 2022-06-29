const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const { celebrate, Joi, errors } = require('celebrate');

const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
  headers: Joi.object().keys({
    'Content-Type': 'application/json',
  }).unknown(true),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
  headers: Joi.object().keys({
    'Content-Type': 'application/json',
  }).unknown(true),
}), login);

app.use(auth);

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use(errors());

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Страницы не существует' });
});

/* eslint-disable-next-line */
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
