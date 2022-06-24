const router = require('express').Router();
const {
  getUsers, getUser, updateProfile, updateAvatar, createUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/me', getUser);
router.get('/:userId', getUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
