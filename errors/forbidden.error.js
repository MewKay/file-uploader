class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "Forbidden Error";
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
