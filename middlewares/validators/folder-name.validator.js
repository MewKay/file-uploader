const { ExpressValidator } = require("express-validator");
const { folderNameInvalids, ranges } = require("../../constants/validation");

const { body } = new ExpressValidator({
  isNameValid: (value) => {
    for (let character of folderNameInvalids.characters) {
      if (value.includes(character)) {
        throw new Error(
          `Folder name must not contain the "${character}" character.`,
        );
      }
    }

    for (let string of folderNameInvalids.string) {
      if (value === string) {
        throw new Error(`Folder name must not be "${string}"`);
      }
    }

    return true;
  },
});

const folderNameValidator = body("folderName")
  .trim()
  .isLength(ranges.folderName)
  .withMessage(
    `Folder name must be between ${ranges.folderName.min} and ${ranges.folderName.max} characters.`,
  )
  .isNameValid();

module.exports = folderNameValidator;
