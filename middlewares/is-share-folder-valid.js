const prisma = require("../config/prisma-client");
const { isPast } = require("date-fns");
const NotFoundError = require("../errors/not-found.error");

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

  if (isPast(sharedFolder.public.expires_at)) {
    await prisma.publicFolder.delete({
      where: {
        id: publicFolderId,
      },
    });

    throw new NotFoundError("No such shared folder");
  }

  req.sharedRootFolder = sharedFolder;
  next();
};

module.exports = isShareFolderValid;
