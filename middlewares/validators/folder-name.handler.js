const { validationResult } = require("express-validator");
const { folderNameParentFolderUrl } = require("../../utils/file.util");

const folderNameValidationHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const errorsArray = errors
    .formatWith((error) => ({
      msg: error.msg,
    }))
    .array();

  req.flash("folderNameErrors", errorsArray);

  const parentFolderUrl = folderNameParentFolderUrl(req.originalUrl);
  return res.redirect(parentFolderUrl);
};

module.exports = folderNameValidationHandler;
