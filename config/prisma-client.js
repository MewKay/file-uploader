const { PrismaClient } = require("../generated/prisma");
const { format } = require("date-fns");

const prisma = new PrismaClient().$extends({
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
});

module.exports = prisma;
