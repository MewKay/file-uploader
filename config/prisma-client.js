const { PrismaClient } = require("../generated/prisma");
const { format } = require("date-fns");
const { formatFileSize } = require("../utils/prisma.util");

const prisma = new PrismaClient()
  .$extends({
    name: "folderDateFormatted",
    result: {
      folder: {
        formattedDate: {
          needs: { updated_at: true },
          compute(folder) {
            return format(folder.updated_at, "d MMM y - p");
          },
        },
      },
    },
  })
  .$extends({
    name: "fileDateAndSizeFormatted",
    result: {
      file: {
        formattedDate: {
          needs: { upload_time: true },
          compute(file) {
            return format(file.upload_time, "d MMM y - p");
          },
        },
        formattedFullDate: {
          needs: { upload_time: true },
          compute(file) {
            return format(file.upload_time, "EEEE do MMMM y 'at' p");
          },
        },
        formattedSize: {
          needs: { size: true },
          compute(file) {
            return formatFileSize(file.size);
          },
        },
      },
    },
  });

module.exports = prisma;
