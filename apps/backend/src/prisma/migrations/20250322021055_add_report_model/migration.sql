-- CreateTable
CREATE TABLE `Report` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reason` ENUM('spam', 'abuse', 'fake_profile', 'inappropriate', 'other') NOT NULL,
    `details` VARCHAR(191) NULL,
    `reported_by` INTEGER NOT NULL,
    `reported_user` INTEGER NOT NULL,
    `time_report` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_reported_by_fkey` FOREIGN KEY (`reported_by`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_reported_user_fkey` FOREIGN KEY (`reported_user`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
