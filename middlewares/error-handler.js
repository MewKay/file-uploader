const ForbiddenError = require("../errors/forbidden.error");
const UnauthorizedError = require("../errors/unauthorized.error");
const NotFoundError = require("../errors/not-found.error");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isUserAuthenticated = req.isAuthenticated();

  if (process.env.NODE_ENV === "dev") {
    console.error(err);
  }

  if (err instanceof UnauthorizedError) {
    res.status(statusCode).redirect("/log-in");
  } else if (err instanceof ForbiddenError) {
    res.status(statusCode).render("error", {
      title: "Forbidden action",
      errorTitle: "Access denied",
      errorText: "Unsufficient permission to access the resource.",
      isUserAuthenticated,
    });
  } else if (err instanceof NotFoundError) {
    res.status(statusCode).render("error", {
      title: "Not Found Error",
      errorTitle: "Resource not found",
      errorText: "The resource requested does not exist.",
      isUserAuthenticated,
    });
  } else {
    res.status(statusCode).render("error", {
      title: "Internal Error",
      errorTitle: "Server Temporarily Unavailable",
      errorText:
        "Server is experiencing some technical difficulties. Please try again in a few minutes.",
      isUserAuthenticated,
    });
  }
};

module.exports = errorHandler;
