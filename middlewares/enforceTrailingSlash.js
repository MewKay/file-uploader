const enforceTrailingSlash = (req, res, next) => {
  if (req.originalUrl.endsWith("/")) {
    return next();
  }

  res.status(301).redirect(req.originalUrl + "/");
};

module.exports = enforceTrailingSlash;
