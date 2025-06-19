-- CreateTable
CREATE TABLE `matches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_1_id` INTEGER NOT NULL,
    `user_2_id` INTEGER NOT NULL,
    `matched_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_accept` BOOLEAN NOT NULL DEFAULT false,

    INDEX `user_1_id`(`user_1_id`),
    INDEX `user_2_id`(`user_2_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_favorite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `favorite_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `display_name` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `verify_token` VARCHAR(191) NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(20) NULL,
    `birthday` DATE NULL,
    `gender` ENUM('male', 'female', 'other') NOT NULL,
    `preferred_gender` ENUM('male', 'female', 'both') NOT NULL,
    `status` ENUM('online', 'offline', 'busy') NULL DEFAULT 'offline',
    `time_register` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_full_information` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Base_inf` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bio_id` INTEGER NULL,
    `zodiac_id` INTEGER NULL,
    `character_id` INTEGER NULL,
    `communicate_style_id` INTEGER NULL,
    `love_language_id` INTEGER NULL,
    `future_family_id` INTEGER NULL,
    `sexual_orientation_id` INTEGER NULL,

    UNIQUE INDEX `bio_id`(`bio_id`),
    INDEX `character_id`(`character_id`),
    INDEX `communicate_style_id`(`communicate_style_id`),
    INDEX `future_family_id`(`future_family_id`),
    INDEX `love_language_id`(`love_language_id`),
    INDEX `zodiac_id`(`zodiac_id`),
    INDEX `Base_inf_sexual_orientation_id_idx`(`sexual_orientation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `status` ENUM('active', 'inactive') NULL DEFAULT 'active',
    `name` VARCHAR(255) NULL,
    `age` INTEGER NULL,
    `address` VARCHAR(191) NULL,
    `min_radius` INTEGER NULL,
    `max_radius` INTEGER NULL,
    `searching_for_id` INTEGER NULL,
    `about_me` TEXT NULL,

    UNIQUE INDEX `user_id`(`user_id`),
    INDEX `searching_for_id`(`searching_for_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Career` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Character` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Communicate_style` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Diet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Education` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Favorite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FutureFamily` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Language` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lifestyle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bio_id` INTEGER NULL,
    `drink` BOOLEAN NULL DEFAULT false,
    `smoke` BOOLEAN NULL DEFAULT false,
    `train` BOOLEAN NULL DEFAULT false,
    `pet_id` INTEGER NULL,
    `diet_id` INTEGER NULL,
    `sleep_id` INTEGER NULL,
    `snu_id` INTEGER NULL,

    UNIQUE INDEX `bio_id`(`bio_id`),
    INDEX `diet_id`(`diet_id`),
    INDEX `pet_id`(`pet_id`),
    INDEX `sleep_id`(`sleep_id`),
    INDEX `snu_id`(`snu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Love_language` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Photo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bio_id` INTEGER NULL,
    `url` TEXT NOT NULL,
    `is_profile_pic` BOOLEAN NULL DEFAULT false,
    `uploaded_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `bio_id`(`bio_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Religion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SNU` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Searchingfor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sleep` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Zodiac` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `main_inf` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bio_id` INTEGER NULL,
    `height` VARCHAR(10) NULL,
    `location` VARCHAR(255) NULL,
    `language_id` INTEGER NULL,
    `religion_id` INTEGER NULL,
    `career_id` INTEGER NULL,
    `education_id` INTEGER NULL,

    UNIQUE INDEX `bio_id`(`bio_id`),
    INDEX `career_id`(`career_id`),
    INDEX `education_id`(`education_id`),
    INDEX `language_id`(`language_id`),
    INDEX `religion_id`(`religion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `match_id` INTEGER NOT NULL,
    `sender_id` INTEGER NOT NULL,
    `receiver_id` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `sent_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `messages_match_id_idx`(`match_id`),
    INDEX `messages_receiver_id_idx`(`receiver_id`),
    INDEX `messages_sender_id_idx`(`sender_id`),
    INDEX `messages_sent_at_idx`(`sent_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reason` TEXT NULL,
    `reported_by` INTEGER NULL,
    `reported_user` INTEGER NULL,
    `time_report` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `reported_by`(`reported_by`),
    INDEX `reported_user`(`reported_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sexual_orientation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recommendation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `recommendedUserId` INTEGER NOT NULL,
    `score` DOUBLE NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `recommendation_userId_idx`(`userId`),
    INDEX `recommendation_recommendedUserId_idx`(`recommendedUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `receiver_id` INTEGER NOT NULL,
    `sender_id` INTEGER NULL,
    `type` ENUM('NEW_MATCH', 'NEW_MESSAGE', 'REPORT_RECEIVED', 'PROFILE_VIEW', 'LIKED') NOT NULL,
    `entity_id` INTEGER NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_hidden` BOOLEAN NOT NULL DEFAULT false,

    INDEX `notifications_receiver_id_idx`(`receiver_id`),
    INDEX `notifications_sender_id_idx`(`sender_id`),
    INDEX `notifications_type_idx`(`type`),
    INDEX `notifications_entity_id_idx`(`entity_id`),
    INDEX `notifications_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_ibfk_1` FOREIGN KEY (`user_1_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_ibfk_2` FOREIGN KEY (`user_2_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_favorite` ADD CONSTRAINT `user_favorite_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_favorite` ADD CONSTRAINT `user_favorite_favorite_id_fkey` FOREIGN KEY (`favorite_id`) REFERENCES `Favorite`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Base_inf` ADD CONSTRAINT `Base_inf_ibfk_1` FOREIGN KEY (`bio_id`) REFERENCES `Bio`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Base_inf` ADD CONSTRAINT `Base_inf_ibfk_2` FOREIGN KEY (`zodiac_id`) REFERENCES `Zodiac`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Base_inf` ADD CONSTRAINT `Base_inf_ibfk_3` FOREIGN KEY (`character_id`) REFERENCES `Character`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Base_inf` ADD CONSTRAINT `Base_inf_ibfk_4` FOREIGN KEY (`communicate_style_id`) REFERENCES `Communicate_style`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Base_inf` ADD CONSTRAINT `Base_inf_ibfk_5` FOREIGN KEY (`love_language_id`) REFERENCES `Love_language`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Base_inf` ADD CONSTRAINT `Base_inf_ibfk_6` FOREIGN KEY (`future_family_id`) REFERENCES `FutureFamily`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Base_inf` ADD CONSTRAINT `Base_inf_sexual_orientation_id_fkey` FOREIGN KEY (`sexual_orientation_id`) REFERENCES `sexual_orientation`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Bio` ADD CONSTRAINT `Bio_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Bio` ADD CONSTRAINT `Bio_ibfk_2` FOREIGN KEY (`searching_for_id`) REFERENCES `Searchingfor`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Lifestyle` ADD CONSTRAINT `Lifestyle_ibfk_1` FOREIGN KEY (`bio_id`) REFERENCES `Bio`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Lifestyle` ADD CONSTRAINT `Lifestyle_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `Pet`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Lifestyle` ADD CONSTRAINT `Lifestyle_ibfk_3` FOREIGN KEY (`diet_id`) REFERENCES `Diet`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Lifestyle` ADD CONSTRAINT `Lifestyle_ibfk_4` FOREIGN KEY (`sleep_id`) REFERENCES `Sleep`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Lifestyle` ADD CONSTRAINT `Lifestyle_ibfk_5` FOREIGN KEY (`snu_id`) REFERENCES `SNU`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Photo` ADD CONSTRAINT `Photo_ibfk_1` FOREIGN KEY (`bio_id`) REFERENCES `Bio`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `main_inf` ADD CONSTRAINT `main_inf_ibfk_1` FOREIGN KEY (`bio_id`) REFERENCES `Bio`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `main_inf` ADD CONSTRAINT `main_inf_ibfk_2` FOREIGN KEY (`language_id`) REFERENCES `Language`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `main_inf` ADD CONSTRAINT `main_inf_ibfk_3` FOREIGN KEY (`religion_id`) REFERENCES `Religion`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `main_inf` ADD CONSTRAINT `main_inf_ibfk_4` FOREIGN KEY (`career_id`) REFERENCES `Career`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `main_inf` ADD CONSTRAINT `main_inf_ibfk_5` FOREIGN KEY (`education_id`) REFERENCES `Education`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`reported_by`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`reported_user`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recommendation` ADD CONSTRAINT `recommendation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recommendation` ADD CONSTRAINT `recommendation_recommendedUserId_fkey` FOREIGN KEY (`recommendedUserId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
