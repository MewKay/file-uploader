const { body } = require("express-validator");
const { folderNameInvalids, ranges } = require("../../constants/validation");
const { queryFolderFromPath } = require("../../utils/controller.util");
const ValidationError = require("../../errors/validation.error");

const isNameValid = (value) => {
  for (let character of folderNameInvalids.characters) {
    if (value.includes(character)) {
      throw new ValidationError(
        `Folder name must not contain the "${character}" character.`,
      );
    }
  }

  for (let string of folderNameInvalids.string) {
    if (value === string) {
      throw new ValidationError(`Folder name must not be "${string}"`);
    }
  }

  return true;
};

const isNameTaken =
  (operation = "create") =>
  async (value, { req }) => {
    const { user } = req;
    const folderPathParams = structuredClone(req.params.folderPathParams) || [];
    folderPathParams.push(value);

    if (operation === "update") {
      // Remove the second to last element which should be the folder name to be updated
      folderPathParams.splice(-2, 1);
    }

    const folder = await queryFolderFromPath(user.id, folderPathParams);

    console.log(folderPathParams);
    if (folder) {
      throw new ValidationError(
        `Folder with name "${folder.name}" already exists.`,
      );
    }

    return true;
  };

const folderNameValidator = (operation) =>
  body("folderName")
    .trim()
    .isLength(ranges.folderName)
    .withMessage(
      `Folder name must be between ${ranges.folderName.min} and ${ranges.folderName.max} characters.`,
    )
    .custom(isNameValid)
    .bail()
    .custom(isNameTaken(operation));

module.exports = folderNameValidator;
