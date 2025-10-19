const UnauthorizedError = require("../errors/unauthorized.error");

const isAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    throw new UnauthorizedError("Authentication required");
  }

  next();
};

const authRedirect = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/files/");
  }

  next();
};

module.exports = { isAuth, authRedirect };
