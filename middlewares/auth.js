const jwt = require('jsonwebtoken');

const UNAUTHORIZED_ERROR_MESSAGE = 'Необходима авторизация';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401)
      .send({ message: UNAUTHORIZED_ERROR_MESSAGE });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'magic-key');
  } catch (err) {
    return res.status(401)
      .send({ message: UNAUTHORIZED_ERROR_MESSAGE });
  }

  req.user = payload;

  return next();
};
