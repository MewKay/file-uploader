const prisma = require("../config/prisma-client");
const bcrypt = require("bcryptjs");
const { matchedData } = require("express-validator");
const signUpValidator = require("../middlewares/validators/sign-up.validator");
const signUpValidationHandler = require("../middlewares/validators/sign-up.handler");

const signUpGet = (req, res) => {
  res.render("sign-up", { title: "Sign Up" });
};

const signUpPost = [
  signUpValidator,
  signUpValidationHandler,
  async (req, res) => {
    const { username, password } = matchedData(req);
    const SALT = 10;

    const encryptedPassword = await bcrypt.hash(password, SALT);

    const { id: newUserId } = await prisma.user.create({
      data: {
        username: username,
        password: encryptedPassword,
      },
    });
    await prisma.folder.create({
      data: {
        name: "Your Files",
        path: "/",
        is_root: true,
        owner_id: newUserId,
      },
    });

    req.flash(
      "signUpSuccess",
      "Account created successfully! You can now log in.",
    );

    res.redirect("/log-in");
  },
];

module.exports = { signUpGet, signUpPost };
