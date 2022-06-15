const usersRouter = require('express').Router();
const { getUsers, createUser, getUsersById } = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.post('/users', createUser);
usersRouter.get('/users/:userId', getUsersById);

module.exports = usersRouter;