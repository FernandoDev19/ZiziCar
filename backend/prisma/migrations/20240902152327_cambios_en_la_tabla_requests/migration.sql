/*
  Warnings:

  - You are about to drop the column `id_gamma` on the `ZIC_REQ_REQUESTS` table. All the data in the column will be lost.
  - You are about to drop the column `id_transmission` on the `ZIC_REQ_REQUESTS` table. All the data in the column will be lost.
  - Added the required column `gamma_id` to the `ZIC_REQ_REQUESTS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transmision_id` to the `ZIC_REQ_REQUESTS` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ZIC_REQ_REQUESTS` DROP FOREIGN KEY `ZIC_REQ_REQUESTS_id_gamma_fkey`;

-- DropForeignKey
ALTER TABLE `ZIC_REQ_REQUESTS` DROP FOREIGN KEY `ZIC_REQ_REQUESTS_id_transmission_fkey`;

-- AlterTable
ALTER TABLE `ZIC_REQ_REQUESTS` DROP COLUMN `id_gamma`,
    DROP COLUMN `id_transmission`,
    ADD COLUMN `gamma_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `transmision_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ZIC_REQ_REQUESTS` ADD CONSTRAINT `ZIC_REQ_REQUESTS_gamma_id_fkey` FOREIGN KEY (`gamma_id`) REFERENCES `ZIC_ADM_GAMMA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ZIC_REQ_REQUESTS` ADD CONSTRAINT `ZIC_REQ_REQUESTS_transmision_id_fkey` FOREIGN KEY (`transmision_id`) REFERENCES `ZIC_ADM_TRANSMISSION`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
