/*
  Warnings:

  - You are about to alter the column `weight` on the `list` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `pricePerWeight` on the `list` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to drop the column `listId` on the `list_menu` table. All the data in the column will be lost.
  - Added the required column `listMenuId` to the `list` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `list_menu` DROP FOREIGN KEY `list_menu_listMenuId_fkey`;

-- AlterTable
ALTER TABLE `list` ADD COLUMN `actualPrice` DECIMAL(10, 2) NULL,
    ADD COLUMN `listMenuId` INTEGER NOT NULL,
    ADD COLUMN `netPrice` DECIMAL(10, 2) NULL,
    MODIFY `weight` DECIMAL(10, 2) NULL,
    MODIFY `pricePerWeight` DECIMAL(10, 2) NULL;

-- AlterTable
ALTER TABLE `list_menu` DROP COLUMN `listId`,
    MODIFY `issuedDate` VARCHAR(191) NULL,
    MODIFY `dueDate` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `list` ADD CONSTRAINT `list_listMenuId_fkey` FOREIGN KEY (`listMenuId`) REFERENCES `list_menu`(`listMenuId`) ON DELETE RESTRICT ON UPDATE CASCADE;
