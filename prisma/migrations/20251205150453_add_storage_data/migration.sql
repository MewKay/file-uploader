/*
  Warnings:

  - You are about to drop the column `download_link` on the `files` table. All the data in the column will be lost.
  - Added the required column `storage_file_path` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storage_folder_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "download_link",
ADD COLUMN     "storage_file_path" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "storage_folder_id" TEXT NOT NULL;
