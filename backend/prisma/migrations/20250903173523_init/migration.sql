-- CreateTable
CREATE TABLE `ZIC_REQ_ANSWERS` (
    `id` VARCHAR(191) NOT NULL DEFAULT (uuid()),
    `request_id` VARCHAR(191) NOT NULL,
    `renter_id` VARCHAR(191) NOT NULL,
    `answer_type` VARCHAR(50) NOT NULL,
    `category` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fs_provider_answer`(`renter_id`),
    INDEX `fs_request_answer`(`request_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZIC_REQ_CITIES` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZIC_ADM_CONTINENTS` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZIC_ADM_CUSTOMERS` (
    `id` VARCHAR(199) NOT NULL DEFAULT (uuid()),
    `request_id` VARCHAR(199) NOT NULL,
    `quote_id` VARCHAR(199) NOT NULL,
    `identification` VARCHAR(20) NOT NULL,
    `credit_card_holder_name` VARCHAR(40) NOT NULL,
    `gender` VARCHAR(20) NULL,
    `birthdate` DATETIME(0) NULL,
    `email` VARCHAR(199) NULL,
    `phone` VARCHAR(16) NOT NULL,
    `country` VARCHAR(50) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `address` VARCHAR(35) NOT NULL,
    `confirmed_payment` BOOLEAN NOT NULL DEFAULT false,
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` DATETIME(0) NULL,

    INDEX `fs_requests_customers`(`request_id`),
    INDEX `fs_quotes_customers`(`quote_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZIC_ADM_FUELS` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZIC_ADM_GAMMA` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `precio_promedio` DECIMAL(10, 0) NOT NULL,

    UNIQUE INDEX `ZIC_ADM_GAMMA_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZIC_ADM_COUNTRIES` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `prefix` INTEGER NOT NULL,
    `continent_id` INTEGER NOT NULL,

    INDEX `fs_continents`(`continent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZIC_ADM_GLOBAL_CITIES` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `state_id` INTEGER NOT NULL,

    INDEX `fs_state_of_city`(`state_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZIC_ADM_STATES` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `country_id` INTEGER NOT NULL,

    INDEX `fs_country_of_state`(`country_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZIC_ADM_PROVIDERS` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `nit` VARCHAR(20) NOT NULL,
    `phone` VARCHAR(16) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `country_id` INTEGER NOT NULL,
    `state_id` INTEGER NULL,
    `city_id` INTEGER NULL,
    `address` VARCHAR(191) NOT NULL,
    `cities_preferences` LONGTEXT NULL,
    `percentage_of_rent` INTEGER NOT NULL,
    `allowed_payment_method` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `nit`(`nit`),
    INDEX `fs_city_of_provider`(`city_id`),
    INDEX `fs_country_of_provider`(`country_id`),
    INDEX `fs_state_of_provider`(`state_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZIC_ADM_QUOTES` (
    `id` VARCHAR(199) NOT NULL DEFAULT (uuid()),
    `request_id` VARCHAR(199) NOT NULL,
    `renter_id` VARCHAR(199) NULL,
    `phone_client` VARCHAR(16) NOT NULL,
    `rent` INTEGER NOT NULL,
    `overtime` INTEGER NOT NULL,
    `home_delivery` INTEGER NOT NULL,
    `home_collection` INTEGER NOT NULL,
    `return_or_collection_different_city` INTEGER NOT NULL,
    `total_value` INTEGER NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `transmission_id` VARCHAR(199) NOT NULL,
    `model` INTEGER NOT NULL,
    `color` VARCHAR(30) NOT NULL,
    `plate_end_in` VARCHAR(30) NOT NULL,
    `value_to_block_on_credit_card` INTEGER NOT NULL,
    `allowed_payment_method` VARCHAR(50) NOT NULL,
    `available_kilometers` VARCHAR(30) NOT NULL,
    `percentage_of_total_value` VARCHAR(4) NOT NULL,
    `percentage_in_values` INTEGER NOT NULL,
    `comments` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fs_renter`(`renter_id`),
    INDEX `fs_transmission`(`transmission_id`),
    INDEX `fs_request`(`request_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZIC_ADM_REQUEST_PROVIDER` (
    `id` VARCHAR(199) NOT NULL DEFAULT (uuid()),
    `request_id` VARCHAR(199) NOT NULL,
    `provider_id` VARCHAR(199) NOT NULL,
    `sent_at` TIMESTAMP(0) NOT NULL,

    INDEX `fs_providers_requests`(`provider_id`),
    INDEX `fs_request_to_providers`(`request_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZIC_REQ_REQUESTS` (
    `id` VARCHAR(191) NOT NULL,
    `sent_to` INTEGER NOT NULL DEFAULT 0,
    `quotes` INTEGER NOT NULL DEFAULT 0,
    `answers` INTEGER NOT NULL DEFAULT 0,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `comments` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_entry_city` INTEGER NOT NULL,
    `receive_at_airport` BOOLEAN NOT NULL DEFAULT false,
    `id_devolution_city` INTEGER NOT NULL,
    `returns_at_airport` BOOLEAN NOT NULL DEFAULT false,
    `devolution_date` DATETIME(3) NOT NULL,
    `devolution_time` VARCHAR(191) NOT NULL,
    `entry_date` DATETIME(3) NOT NULL,
    `entry_time` VARCHAR(191) NOT NULL,
    `gamma_id` VARCHAR(191) NOT NULL,
    `transmission_id` VARCHAR(191) NOT NULL,
    `observations` LONGTEXT NULL,

    INDEX `ZIC_REQ_REQUESTS_gamma_id_fkey`(`gamma_id`),
    INDEX `ZIC_REQ_REQUESTS_transmision_id_fkey`(`transmission_id`),
    INDEX `ZIC_REQ_REQUESTS_id_devolution_city_fkey`(`id_devolution_city`),
    INDEX `ZIC_REQ_REQUESTS_id_entry_city_fkey`(`id_entry_city`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZIC_ADM_TRANSMISSION` (
    `id` VARCHAR(191) NOT NULL DEFAULT (uuid()),
    `name` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZIC_ADM_USERS` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(199) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `password` VARCHAR(191) NOT NULL,
    `provider_id` VARCHAR(191) NULL,
    `role` VARCHAR(10) NOT NULL DEFAULT 'user',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `email`(`email`),
    INDEX `ZIC_ADM_USERS_provider_id_fkey`(`provider_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZIC_ADM_BRANDS` (
    `id` VARCHAR(191) NOT NULL DEFAULT (uuid()),
    `name` VARCHAR(191) NOT NULL,
    `doors` INTEGER NOT NULL,
    `positions` INTEGER NOT NULL,
    `generic_image` VARCHAR(191) NOT NULL,
    `large_suitcases` INTEGER NULL,
    `small_suitcases` INTEGER NULL,
    `cylinder_capacity` DECIMAL(10, 0) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ZIC_REQ_ANSWERS` ADD CONSTRAINT `fs_provider_answer` FOREIGN KEY (`renter_id`) REFERENCES `ZIC_ADM_PROVIDERS`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ZIC_REQ_ANSWERS` ADD CONSTRAINT `fs_request_answer` FOREIGN KEY (`request_id`) REFERENCES `ZIC_REQ_REQUESTS`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ZIC_ADM_CUSTOMERS` ADD CONSTRAINT `fs_quotes_customers` FOREIGN KEY (`quote_id`) REFERENCES `ZIC_ADM_QUOTES`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ZIC_ADM_CUSTOMERS` ADD CONSTRAINT `fs_requests_customers` FOREIGN KEY (`request_id`) REFERENCES `ZIC_REQ_REQUESTS`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ZIC_ADM_COUNTRIES` ADD CONSTRAINT `fs_continents` FOREIGN KEY (`continent_id`) REFERENCES `ZIC_ADM_CONTINENTS`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ZIC_ADM_GLOBAL_CITIES` ADD CONSTRAINT `fs_state_of_city` FOREIGN KEY (`state_id`) REFERENCES `ZIC_ADM_STATES`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ZIC_ADM_STATES` ADD CONSTRAINT `fs_country_of_department` FOREIGN KEY (`country_id`) REFERENCES `ZIC_ADM_COUNTRIES`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ZIC_ADM_PROVIDERS` ADD CONSTRAINT `fs_city_of_provider` FOREIGN KEY (`city_id`) REFERENCES `ZIC_ADM_GLOBAL_CITIES`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ZIC_ADM_PROVIDERS` ADD CONSTRAINT `fs_country_of_provider` FOREIGN KEY (`country_id`) REFERENCES `ZIC_ADM_COUNTRIES`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ZIC_ADM_PROVIDERS` ADD CONSTRAINT `fs_state_of_provider` FOREIGN KEY (`state_id`) REFERENCES `ZIC_ADM_STATES`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ZIC_ADM_QUOTES` ADD CONSTRAINT `fs_renter` FOREIGN KEY (`renter_id`) REFERENCES `ZIC_ADM_PROVIDERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ZIC_ADM_QUOTES` ADD CONSTRAINT `fs_request` FOREIGN KEY (`request_id`) REFERENCES `ZIC_REQ_REQUESTS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ZIC_ADM_QUOTES` ADD CONSTRAINT `fs_transmission` FOREIGN KEY (`transmission_id`) REFERENCES `ZIC_ADM_TRANSMISSION`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ZIC_ADM_REQUEST_PROVIDER` ADD CONSTRAINT `fs_providers_requests` FOREIGN KEY (`provider_id`) REFERENCES `ZIC_ADM_PROVIDERS`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ZIC_ADM_REQUEST_PROVIDER` ADD CONSTRAINT `fs_request_to_providers` FOREIGN KEY (`request_id`) REFERENCES `ZIC_REQ_REQUESTS`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ZIC_REQ_REQUESTS` ADD CONSTRAINT `ZIC_REQ_REQUESTS_gamma_id_fkey` FOREIGN KEY (`gamma_id`) REFERENCES `ZIC_ADM_GAMMA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ZIC_REQ_REQUESTS` ADD CONSTRAINT `ZIC_REQ_REQUESTS_transmision_id_fkey` FOREIGN KEY (`transmission_id`) REFERENCES `ZIC_ADM_TRANSMISSION`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ZIC_REQ_REQUESTS` ADD CONSTRAINT `fs_devolution_city` FOREIGN KEY (`id_devolution_city`) REFERENCES `ZIC_ADM_GLOBAL_CITIES`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ZIC_REQ_REQUESTS` ADD CONSTRAINT `fs_entry_city` FOREIGN KEY (`id_entry_city`) REFERENCES `ZIC_ADM_GLOBAL_CITIES`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ZIC_ADM_USERS` ADD CONSTRAINT `ZIC_ADM_USERS_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `ZIC_ADM_PROVIDERS`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
