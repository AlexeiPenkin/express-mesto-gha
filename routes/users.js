const router = require('express').Router();
const {
  getUsers, createUser, getUsersById, updateProfile, updateAvatar,
} = require('../controllers/users'); /* login, */

router.get('/', getUsers);
router.post('/signup', createUser);
// router.post('/', createUser);
router.get('/:userId', getUsersById);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);
// router.post('/signin', login);

module.exports = router;
