/*
  Warnings:

  - You are about to drop the column `userId` on the `UserPreference` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userPreferenceId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `UserPreference` DROP FOREIGN KEY `UserPreference_userId_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `userPreferenceId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `UserPreference` DROP COLUMN `userId`;

-- CreateIndex
CREATE UNIQUE INDEX `User_userPreferenceId_key` ON `User`(`userPreferenceId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_userPreferenceId_fkey` FOREIGN KEY (`userPreferenceId`) REFERENCES `UserPreference`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
