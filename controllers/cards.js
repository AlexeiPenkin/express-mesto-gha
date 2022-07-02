const Card = require('../models/card');

const BAD_REQUEST_ERROR_MESSAGE = 'Переданы некорректные данные';
// const FORBIDDEN_ERROR_MESSAGE = 'Доступ запрещён';
const NOT_FOUND_ERROR_MESSAGE = 'Карточка с указанным _id не найдена';
const INTERNAL_SERVER_ERROR_MESSAGE = 'Произошла внутренняя ошибка сервера';

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200)
      .send({ data: cards }))
    .catch(() => {
      res.status(500)
        .send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  const likes = [];
  Card.create({
    name, link, owner, likes,
  })
    .then((card) => res.status(200)
      .send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: BAD_REQUEST_ERROR_MESSAGE });
      } else {
        res.status(500)
          .send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: NOT_FOUND_ERROR_MESSAGE });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: BAD_REQUEST_ERROR_MESSAGE });
      } else {
        res.status(500).send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((like) => {
      if (!like) {
        res.status(404)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      return res.status(200)
        .send(like); /* { like } */
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: BAD_REQUEST_ERROR_MESSAGE });
      }
      return res.status(500);
      // .send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((like) => {
      if (!like) {
        res.status(404)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      return res.status(200)
        .send(like); /* { like } */
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: BAD_REQUEST_ERROR_MESSAGE });
      }
      return res.status(500);
      // .send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    });
};
