const passport = require("passport");
const logInValidator = require("../middlewares/validators/log-in.validator");
const logInValidationHandler = require("../middlewares/validators/log-in.handler");

const logInGet = (req, res) => {
  const { messages, signUpSuccessMessage } = req.session;
  delete req.session.signUpSuccessMessage;

  res.render("log-in", {
    title: "Log In",
    authFailureMessages: messages?.pop(),
    signUpSuccessMessage: signUpSuccessMessage,
  });
};

const logInPost = [
  logInValidator,
  logInValidationHandler,
  passport.authenticate("local", {
    successRedirect: "/files",
    failureRedirect: "/log-in",
    failureMessage: true,
  }),
];

module.exports = { logInGet, logInPost };
