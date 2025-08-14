/*
  Warnings:

  - Added the required column `devolution_date` to the `ZIC_REQ_REQUESTS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `devolution_time` to the `ZIC_REQ_REQUESTS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entry_date` to the `ZIC_REQ_REQUESTS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entry_time` to the `ZIC_REQ_REQUESTS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ZIC_REQ_REQUESTS` ADD COLUMN `devolution_date` DATETIME(3) NOT NULL,
    ADD COLUMN `devolution_time` DATETIME(3) NOT NULL,
    ADD COLUMN `entry_date` DATETIME(3) NOT NULL,
    ADD COLUMN `entry_time` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `ZIC_REQ_CITIES` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
