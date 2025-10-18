const enforceTrailingSlash = (req, res, next) => {
  if (!req.originalUrl.endsWith("/")) {
    req.session.save((error) => {
      if (error) return next(error);
      res.status(301).redirect(req.originalUrl + "/");
    });

    return;
  }

  next();
};

module.exports = enforceTrailingSlash;
