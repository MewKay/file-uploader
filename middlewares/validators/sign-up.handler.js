const { validationResult } = require("express-validator");

const signUpValidationHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const errorsArray = errors.array();

  res
    .status(400)
    .render("sign-up", { title: "Sign Up", validationErrors: errorsArray });
};

module.exports = signUpValidationHandler;
