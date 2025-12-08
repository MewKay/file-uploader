const prisma = require("../config/prisma-client");
const NotFoundError = require("../errors/not-found.error");
const { checkSharedFolderExpiry } = require("../utils/share.util");

const isShareFolderValid = async (req, res, next) => {
  const { publicFolderId } = req.params;

  if (!publicFolderId) {
    return next();
  }

  const sharedFolder = await prisma.folder.findFirst({
    where: {
      public: {
        id: publicFolderId,
      },
    },
    include: {
      public: {
        select: {
          id: true,
          expires_at: true,
        },
      },
      owner: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!sharedFolder) {
    throw new NotFoundError("No such shared folder");
  }

  const hasSharedFolderExpired = await checkSharedFolderExpiry(sharedFolder);

  if (hasSharedFolderExpired) {
    throw new NotFoundError("No such shared folder");
  }

  req.sharedRootFolder = sharedFolder;
  next();
};

module.exports = isShareFolderValid;
