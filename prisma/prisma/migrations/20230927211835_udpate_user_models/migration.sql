-- AlterTable
ALTER TABLE `User` MODIFY `blob` LONGBLOB NULL,
    MODIFY `isAdmin` BOOLEAN NULL,
    MODIFY `largeNumber` BIGINT NULL,
    MODIFY `preferences` JSON NULL,
    MODIFY `role` ENUM('BASIC', 'ADMIN') NULL;
