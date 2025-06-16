/*
  Warnings:

  - You are about to drop the column `createdAt` on the `recommendation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `recommendation` DROP FOREIGN KEY `Recommendation_recommendedUserId_fkey`;

-- DropForeignKey
ALTER TABLE `recommendation` DROP FOREIGN KEY `Recommendation_userId_fkey`;

-- AlterTable
ALTER TABLE `recommendation` DROP COLUMN `createdAt`,
    ADD COLUMN `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- CreateIndex
CREATE INDEX `messages_sent_at_idx` ON `messages`(`sent_at`);

-- CreateIndex
CREATE INDEX `notifications_created_at_idx` ON `notifications`(`created_at`);

-- AddForeignKey
ALTER TABLE `recommendation` ADD CONSTRAINT `recommendation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recommendation` ADD CONSTRAINT `recommendation_recommendedUserId_fkey` FOREIGN KEY (`recommendedUserId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `messages` RENAME INDEX `match_id` TO `messages_match_id_idx`;

-- RenameIndex
ALTER TABLE `messages` RENAME INDEX `receiver_id` TO `messages_receiver_id_idx`;

-- RenameIndex
ALTER TABLE `messages` RENAME INDEX `sender_id` TO `messages_sender_id_idx`;

-- RenameIndex
ALTER TABLE `recommendation` RENAME INDEX `Recommendation_recommendedUserId_fkey` TO `recommendation_recommendedUserId_idx`;

-- RenameIndex
ALTER TABLE `recommendation` RENAME INDEX `Recommendation_userId_fkey` TO `recommendation_userId_idx`;
