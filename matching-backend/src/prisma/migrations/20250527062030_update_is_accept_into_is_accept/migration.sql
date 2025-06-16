/*
  Warnings:

  - You are about to drop the column `isAccept` on the `matches` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `matches` DROP COLUMN `isAccept`,
    ADD COLUMN `is_accept` BOOLEAN NOT NULL DEFAULT false;
