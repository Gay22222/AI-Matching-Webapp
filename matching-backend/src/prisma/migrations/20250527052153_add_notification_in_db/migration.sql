-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `receiver_id` INTEGER NOT NULL,
    `sender_id` INTEGER NULL,
    `type` ENUM('NEW_MATCH', 'NEW_MESSAGE', 'REPORT_RECEIVED', 'PROFILE_VIEW') NOT NULL,
    `entity_id` INTEGER NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `notifications_receiver_id_idx`(`receiver_id`),
    INDEX `notifications_sender_id_idx`(`sender_id`),
    INDEX `notifications_type_idx`(`type`),
    INDEX `notifications_entity_id_idx`(`entity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
