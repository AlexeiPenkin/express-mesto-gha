const router = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const {
  createCardValidation,
  deleteCardValidation,
  likeCardValidation,
  dislikeCardValidation,
} = require('../middlewares/validation');

router.get('/', getCards);

router.post('/', createCardValidation, createCard);

router.delete('/:cardId', deleteCardValidation, deleteCard);

router.put('/:cardId/likes', likeCardValidation, likeCard);

router.delete('/:cardId/likes', dislikeCardValidation, dislikeCard);

module.exports = router;
