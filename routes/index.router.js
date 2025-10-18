const router = require("express").Router();

router.get("/", (req, res) => {
  res.redirect("/files/");
});

module.exports = router;
