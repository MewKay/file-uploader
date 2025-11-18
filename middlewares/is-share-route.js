const isShareRoute = (req, res, next) => {
  res.locals.isShareRoute = true;
  next();
};

module.exports = isShareRoute;
