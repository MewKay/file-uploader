const prisma = require("../config/prisma-client");

const querySharedFolder = async (publicFolderId, folderPathParams) => {
  const rootSharedFolder = await prisma.folder.findFirst({
    where: {
      public: {
        id: publicFolderId,
      },
    },
    include: {
      public: {
        select: {
          id: true,
        },
      },
      owner: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!rootSharedFolder) {
    return null;
  }

  const isCurrentFolderRoot = !folderPathParams;
  if (isCurrentFolderRoot) {
    return rootSharedFolder;
  }

  const idPaths = rootSharedFolder.path.split("/").filter((id) => id !== "");
  idPaths.push(rootSharedFolder.id);
  const paramsArray = folderPathParams.filter(
    (folderParam) => folderParam !== "",
  );

  let lastPathFolder;
  for (let folderName of paramsArray) {
    lastPathFolder = await prisma.folder.findFirst({
      where: {
        parent_id: idPaths.at(-1),
        name: folderName,
      },
      include: {
        public: {
          select: {
            id: true,
          },
        },
        owner: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!lastPathFolder) {
      return null;
    }

    idPaths.push(lastPathFolder.id);
  }

  return lastPathFolder;
};

module.exports = { querySharedFolder };
