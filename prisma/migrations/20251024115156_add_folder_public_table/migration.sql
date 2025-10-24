-- CreateTable
CREATE TABLE "public_folders" (
    "id" TEXT NOT NULL,
    "folder_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "public_folders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "public_folders_folder_id_key" ON "public_folders"("folder_id");

-- CreateIndex
CREATE UNIQUE INDEX "public_folders_owner_id_key" ON "public_folders"("owner_id");

-- AddForeignKey
ALTER TABLE "public_folders" ADD CONSTRAINT "public_folders_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public_folders" ADD CONSTRAINT "public_folders_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
