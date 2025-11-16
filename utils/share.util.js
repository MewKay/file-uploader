const prisma = require("../config/prisma-client");

const querySharedFolder = async (publicFolderId, folderPathParams) => {
  const rootSharedFolder = await prisma.folder.findFirst({
    where: {
      public: {
        id: publicFolderId,
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

  const idPaths = rootSharedFolder.path
    .split("/")
    .filter((folderParam) => folderParam !== "");
  idPaths.push(rootSharedFolder.id);

  let lastPathFolder;
  for (let folderName of folderPathParams) {
    lastPathFolder = await prisma.folder.findFirst({
      where: {
        parent_id: idPaths.at(-1),
        name: folderName,
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
