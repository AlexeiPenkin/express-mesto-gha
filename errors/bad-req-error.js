class BAD_REQUEST_ERROR extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BAD_REQUEST_ERROR;
