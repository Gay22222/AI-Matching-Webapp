-- AlterTable
ALTER TABLE `Base_inf` ADD COLUMN `sexual_orientation_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Base_inf_sexual_orientation_id_idx` ON `Base_inf`(`sexual_orientation_id`);

-- AddForeignKey
ALTER TABLE `Base_inf` ADD CONSTRAINT `Base_inf_sexual_orientation_id_fkey` FOREIGN KEY (`sexual_orientation_id`) REFERENCES `sexual_orientation`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;
