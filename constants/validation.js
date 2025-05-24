const ranges = {
  username: {
    min: 4,
    max: 15,
  },
  password: {
    min: 8,
  },
  folderName: {
    min: 1,
    max: 255,
  },
};

const folderNameInvalids = {
  characters: ["/", "\\", "#", "?"],
  string: [".", ".."],
};

const defaultLocale = "en-US";

module.exports = { ranges, folderNameInvalids, defaultLocale };
