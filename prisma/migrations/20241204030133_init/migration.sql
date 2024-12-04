-- CreateTable
CREATE TABLE `product` (
    `productId` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `list` (
    `listId` INTEGER NOT NULL AUTO_INCREMENT,
    `number` INTEGER NOT NULL,
    `weight` DECIMAL(65, 30) NULL,
    `pricePerWeight` DECIMAL(65, 30) NULL,
    `unit` ENUM('PIECE', 'GRAM') NOT NULL,
    `discount` INTEGER NULL,
    `productId` INTEGER NOT NULL,

    PRIMARY KEY (`listId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `list_menu` (
    `listMenuId` INTEGER NOT NULL AUTO_INCREMENT,
    `netPrice` DECIMAL(65, 30) NULL,
    `discountPrice` DECIMAL(65, 30) NULL,
    `actualPrice` DECIMAL(65, 30) NULL,
    `vat` DECIMAL(65, 30) NULL,
    `totalPrice` DECIMAL(65, 30) NULL,
    `isEdit` BOOLEAN NOT NULL DEFAULT true,
    `remark` MEDIUMTEXT NULL,
    `note` MEDIUMTEXT NULL,
    `docNumber` VARCHAR(191) NULL,
    `issuedDate` DATETIME(3) NULL,
    `dueDate` DATETIME(3) NULL,
    `clientName` VARCHAR(191) NULL,
    `taxInvoice` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `remarkNumber` VARCHAR(191) NULL,
    `currency` VARCHAR(191) NULL,
    `listId` INTEGER NOT NULL,

    PRIMARY KEY (`listMenuId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `list` ADD CONSTRAINT `list_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`productId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `list_menu` ADD CONSTRAINT `list_menu_listMenuId_fkey` FOREIGN KEY (`listMenuId`) REFERENCES `list`(`listId`) ON DELETE CASCADE ON UPDATE CASCADE;
