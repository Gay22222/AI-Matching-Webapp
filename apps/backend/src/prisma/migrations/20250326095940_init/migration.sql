-- Create reference tables first
CREATE TABLE `Language` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL
);

CREATE TABLE `Religion` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT
);

CREATE TABLE `Career` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT
);

CREATE TABLE `Education` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT
);

CREATE TABLE `Zodiac` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT
);

CREATE TABLE `Character` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT
);

CREATE TABLE `Communicate_style` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT
);

CREATE TABLE `Love_language` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT
);

CREATE TABLE `FutureFamily` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT
);

CREATE TABLE `Pet` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT
);

CREATE TABLE `Diet` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT
);

CREATE TABLE `Sleep` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT
);

CREATE TABLE `SNU` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT
);

CREATE TABLE `sexual_orientation` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT
);

CREATE TABLE `Favorite` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT
);

CREATE TABLE `Searchingfor` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT
);

-- Create main tables
CREATE TABLE `users` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `display_name` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `phone_number` VARCHAR(20),
    `birthday` DATE,
    `gender` ENUM('male', 'female', 'other') NOT NULL,
    `preferred_gender` ENUM('male', 'female', 'both') NOT NULL,
    `status` ENUM('online', 'offline', 'busy') DEFAULT 'offline',
    `time_register` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `Bio` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT UNIQUE,
    `status` ENUM('active', 'inactive') DEFAULT 'active',
    `name` VARCHAR(255),
    `age` INT,
    `searching_for_id` INT,
    `about_me` TEXT,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`searching_for_id`) REFERENCES `Searchingfor`(`id`)
);

CREATE TABLE `main_inf` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `bio_id` INT UNIQUE,
    `height` VARCHAR(10),
    `location` VARCHAR(255),
    `language_id` INT,
    `religion_id` INT,
    `career_id` INT,
    `education_id` INT,
    FOREIGN KEY (`bio_id`) REFERENCES `Bio`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`language_id`) REFERENCES `Language`(`id`),
    FOREIGN KEY (`religion_id`) REFERENCES `Religion`(`id`),
    FOREIGN KEY (`career_id`) REFERENCES `Career`(`id`),
    FOREIGN KEY (`education_id`) REFERENCES `Education`(`id`)
);

CREATE TABLE `Base_inf` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `bio_id` INT UNIQUE,
    `zodiac_id` INT,
    `character_id` INT,
    `communicate_style_id` INT,
    `love_language_id` INT,
    `future_family_id` INT,
    FOREIGN KEY (`bio_id`) REFERENCES `Bio`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`zodiac_id`) REFERENCES `Zodiac`(`id`),
    FOREIGN KEY (`character_id`) REFERENCES `Character`(`id`),
    FOREIGN KEY (`communicate_style_id`) REFERENCES `Communicate_style`(`id`),
    FOREIGN KEY (`love_language_id`) REFERENCES `Love_language`(`id`),
    FOREIGN KEY (`future_family_id`) REFERENCES `FutureFamily`(`id`)
);

CREATE TABLE `Lifestyle` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `bio_id` INT UNIQUE,
    `drink` BOOLEAN DEFAULT FALSE,
    `smoke` BOOLEAN DEFAULT FALSE,
    `train` BOOLEAN DEFAULT FALSE,
    `pet_id` INT,
    `diet_id` INT,
    `sleep_id` INT,
    `snu_id` INT,
    FOREIGN KEY (`bio_id`) REFERENCES `Bio`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`pet_id`) REFERENCES `Pet`(`id`),
    FOREIGN KEY (`diet_id`) REFERENCES `Diet`(`id`),
    FOREIGN KEY (`sleep_id`) REFERENCES `Sleep`(`id`),
    FOREIGN KEY (`snu_id`) REFERENCES `SNU`(`id`)
);

CREATE TABLE `Photo` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `bio_id` INT,
    `url` TEXT NOT NULL,
    `is_profile_pic` BOOLEAN DEFAULT FALSE,
    `uploaded_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`bio_id`) REFERENCES `Bio`(`id`) ON DELETE CASCADE
);

CREATE TABLE `matches` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_1_id` INT NOT NULL,
    `user_2_id` INT NOT NULL,
    `matched_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_1_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_2_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);


CREATE TABLE `messages` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `match_id` INT NOT NULL,
    `sender_id` INT NOT NULL,
    `receiver_id` INT NOT NULL,
    `content` TEXT NOT NULL,
    `sent_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE `reports` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `reason` TEXT,
    `reported_by` INT,
    `reported_user` INT,
    `time_report` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`reported_by`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`reported_user`) REFERENCES `users`(`id`) ON DELETE CASCADE
);