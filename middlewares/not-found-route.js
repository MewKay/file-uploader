const notFoundRoute = (req, res) => {
  const isUserAuthenticated = req.isAuthenticated();

  res.status(404).render("error", {
    title: "Error 404",
    errorTitle: "Page not found",
    errorText: "The page your are looking for does not exist.",
    isUserAuthenticated,
  });
};

module.exports = notFoundRoute;
