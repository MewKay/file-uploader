const { validationResult } = require("express-validator");
const { sliceUrlEndPath } = require("../../utils/file.util");

const folderNameValidationHandler = (req, res, next) => {
  const { context } = req;
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

  let parentFolderUrl;

  if (context.operation === "update") {
    parentFolderUrl = sliceUrlEndPath(req.originalUrl, 2);
  } else {
    parentFolderUrl = sliceUrlEndPath(req.originalUrl);
  }

  return res.redirect(parentFolderUrl);
};

module.exports = folderNameValidationHandler;
