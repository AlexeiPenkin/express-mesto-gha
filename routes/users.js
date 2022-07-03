const router = require('express').Router();
const {
  getUsers, getUserById, updateProfile, updateAvatar, findUser,
} = require('../controllers/users');

const {
  getUserByIdValidation,
  updateProfileValidation,
  updateAvatarValidation,
} = require('../middlewares/validation');

router.get('/', getUsers);

router.get('/me', findUser);

router.get('/:userId', getUserByIdValidation, getUserById);

router.patch('/me', updateProfileValidation, updateProfile);

router.patch('/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = router;
