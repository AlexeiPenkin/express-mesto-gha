const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const { errors } = require('celebrate');

const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');

const users = require('./routes/users');

const cards = require('./routes/cards');

const { createUserValidation, loginValidation } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signup', createUserValidation, createUser);

app.post('/signin', loginValidation, login);

app.use(auth);

app.use('/users', users);

app.use('/cards', cards);

app.use('/*', (err, req, res, next) => {
  const { statusCode = 404, message } = err;
  res.status(statusCode).send({ message: statusCode === 404 ? 'Страницы не существует' : message,
  });
  return (next);
});

app.use(errors());

/* eslint-disable-next-line */
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
