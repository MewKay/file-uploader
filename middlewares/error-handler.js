const ForbiddenError = require("../errors/forbidden.error");
const UnauthorizedError = require("../errors/unauthorized.error");
const NotFoundError = require("../errors/not-found.error");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "dev") {
    console.error(err);
  }

  if (err instanceof UnauthorizedError) {
    return res.status(statusCode).redirect("/log-in");
  } else if (err instanceof ForbiddenError) {
    return res
      .status(statusCode)
      .send("Unsufficient permission to access the resource");
  } else if (err instanceof NotFoundError) {
    return res.status(statusCode).send(err.message);
  } else {
    res.status(statusCode).send("Internal Error");
  }
};

module.exports = errorHandler;
