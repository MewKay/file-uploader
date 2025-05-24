const { validationResult } = require("express-validator");

const folderNameValidationHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const errorsArray = errors.array();

  res.status(400).send(errorsArray[0].msg);
};

module.exports = folderNameValidationHandler;
