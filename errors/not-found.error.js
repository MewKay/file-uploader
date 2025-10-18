class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFound Error";
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
