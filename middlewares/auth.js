const jwt = require('jsonwebtoken');

const UNAUTHORIZED_ERROR_CODE = 401;
const UNAUTHORIZED_ERROR_MESSAGE = 'Необходима авторизация';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: UNAUTHORIZED_ERROR_MESSAGE });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'magic-key');
  } catch (err) {
    return res.status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: UNAUTHORIZED_ERROR_MESSAGE });
  }

  req.user = payload;

  return next();
};
