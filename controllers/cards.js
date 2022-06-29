const Card = require('../models/card');

const OK_STATUS_CODE = 200;
const BAD_REQUEST_ERROR_CODE = 400;
const BAD_REQUEST_ERROR_MESSAGE = 'Переданы некорректные данные';
const NOT_FOUND_ERROR_CODE = 404;
const NOT_FOUND_ERROR_MESSAGE = 'Карточка с указанным _id не найдена';
const INTERNAL_SERVER_ERROR_CODE = 500;
const INTERNAL_SERVER_ERROR_MESSAGE = 'Произошла внутренняя ошибка сервера';

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(OK_STATUS_CODE)
      .send({ data: cards }))
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR_CODE)
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
    .then((card) => res.status(OK_STATUS_CODE)
      .send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE)
          .send({ message: BAD_REQUEST_ERROR_MESSAGE });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      res.status(OK_STATUS_CODE)
        .send({ data: card });
      // if (!card) {
      //   res.status(NOT_FOUND_ERROR_CODE).send({ message: NOT_FOUND_ERROR_MESSAGE });
      // } else {
      //   res.send({ data: card });
      // }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR_CODE)
          .send({ message: BAD_REQUEST_ERROR_MESSAGE });
      } if (err.name === 'NotFound') {
        return res.status(NOT_FOUND_ERROR_CODE)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
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
        res.status(NOT_FOUND_ERROR_CODE)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      return res.status(OK_STATUS_CODE)
        .send(like); /* { like } */
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR_CODE)
          .send({ message: BAD_REQUEST_ERROR_MESSAGE });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE);
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
        res.status(NOT_FOUND_ERROR_CODE)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      return res.status(OK_STATUS_CODE)
        .send(like); /* { like } */
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR_CODE)
          .send({ message: BAD_REQUEST_ERROR_MESSAGE });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE);
      // .send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    });
};
