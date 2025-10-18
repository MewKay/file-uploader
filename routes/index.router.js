const router = require("express").Router();
const controller = require("../controllers/index.controller");

router.get("/", (req, res) => {
  res.redirect("/files/");
});
router.post("/log-out", controller.loggingOut);

module.exports = router;
