const jwt = require('jsonwebtoken');
const FORBIDDEN_ERROR = require('../errors/forbidden-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new FORBIDDEN_ERROR({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'magic-key');
  } catch (err) {
    return res.status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};
