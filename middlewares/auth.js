const UnauthorizedError = require("../errors/unauthorized.error");

const isAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    throw new UnauthorizedError("Authentication required");
  }

  next();
};

module.exports = { isAuth };
