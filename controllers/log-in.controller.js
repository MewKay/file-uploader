const passport = require("passport");
const logInValidator = require("../middlewares/validators/log-in.validator");
const logInValidationHandler = require("../middlewares/validators/log-in.handler");

const logInGet = (req, res) => {
  res.render("log-in", {
    title: "Log In",
  });
};

const logInPost = [
  logInValidator,
  logInValidationHandler,
  passport.authenticate("local", {
    successRedirect: "/files",
    failureRedirect: "/log-in",
    failureFlash: true,
  }),
];

module.exports = { logInGet, logInPost };
