const { Router } = require("express");
const { queryFolderFromPath } = require("../utils/controller.util");
const prisma = require("../config/prisma-client");

const router = Router({ mergeParams: true });

router.get("/", async (req, res) => {
  res.send("This is file get");
});

module.exports = router;
