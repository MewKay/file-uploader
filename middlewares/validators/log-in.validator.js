const { body } = require("express-validator");
const { ranges } = require("../../constants/validation");

const logInValidator = [
  body("username")
    .trim()
    .isLength(ranges.username)
    .withMessage(
      `Username must be between ${ranges.username.min} and ${ranges.username.max} characters.`,
    )
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers."),
  body("password")
    .isLength(ranges.password)
    .withMessage(
      `Password must be at least ${ranges.password.min} characters long.`,
    ),
];

module.exports = logInValidator;
