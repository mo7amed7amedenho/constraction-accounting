/*
  Warnings:

  - Added the required column `time` to the `Custody` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Custody` ADD COLUMN `time` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `AddAmount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` INTEGER NOT NULL,
    `custodyId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AddAmount` ADD CONSTRAINT `AddAmount_custodyId_fkey` FOREIGN KEY (`custodyId`) REFERENCES `Custody`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
