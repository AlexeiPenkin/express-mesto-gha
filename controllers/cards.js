const Card = require('../models/cards');
const { NotFoundError } = require('../error/NotFoundError');

const cardIdErrorMessage = 'Карточка с указанным _id не найдена'; /* ошибка 404 */
const defaultErrorMessage = 'Произошла внутренняя ошибка сервера'; /* ошибка 500 */

module.exports.getCards = (req, res) => {
  // console.log(req.user._id);
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: defaultErrorMessage }));
};

module.exports.createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: defaultErrorMessage });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new NotFoundError())
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: cardIdErrorMessage });
      }
      if (err instanceof NotFoundError) {
        return res.status(404).send({ message: cardIdErrorMessage });
      }
      return res.send(500).send({ message: defaultErrorMessage });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError())
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      if (err instanceof NotFoundError) {
        return res.status(404).send({ message: cardIdErrorMessage });
      }
      return res.send(500).send({ message: defaultErrorMessage });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError())
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      if (err instanceof NotFoundError) {
        return res.status(404).send({ message: cardIdErrorMessage });
      }
      return res.send(500).send({ message: defaultErrorMessage });
    });
};
