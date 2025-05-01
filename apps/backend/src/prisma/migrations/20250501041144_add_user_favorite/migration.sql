-- CreateTable
CREATE TABLE `user_favorite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `favorite_id` INTEGER NOT NULL,

    INDEX `user_favorite_user_id_idx`(`user_id`),
    INDEX `user_favorite_favorite_id_idx`(`favorite_id`),
    UNIQUE INDEX `user_favorite_user_id_favorite_id_key`(`user_id`, `favorite_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_favorite` ADD CONSTRAINT `user_favorite_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_favorite` ADD CONSTRAINT `user_favorite_favorite_id_fkey` FOREIGN KEY (`favorite_id`) REFERENCES `Favorite`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
