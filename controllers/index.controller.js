const { isAuth } = require("../middlewares/auth");

const loggingOut = [
  isAuth,
  (req, res, next) => {
    req.logout((error) => {
      if (error) {
        return next(error);
      }

      res.redirect("/");
    });
  },
];

module.exports = { loggingOut };
