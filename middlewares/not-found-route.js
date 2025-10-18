const notFoundRoute = (req, res) => {
  res.status(404).send("Route not found");
};

module.exports = notFoundRoute;
