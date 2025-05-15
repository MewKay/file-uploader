const { validationResult } = require("express-validator");

const logInValidationHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const errorsArray = errors.array();

  res
    .status(400)
    .render("log-in", { title: "Log In", validationErrors: errorsArray });
};

module.exports = logInValidationHandler;
