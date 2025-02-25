/*
  Warnings:

  - You are about to drop the `_recipediet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_recipeingredient` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,userId]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_recipediet` DROP FOREIGN KEY `_RecipeDiet_A_fkey`;

-- DropForeignKey
ALTER TABLE `_recipediet` DROP FOREIGN KEY `_RecipeDiet_B_fkey`;

-- DropForeignKey
ALTER TABLE `_recipeingredient` DROP FOREIGN KEY `_RecipeIngredient_A_fkey`;

-- DropForeignKey
ALTER TABLE `_recipeingredient` DROP FOREIGN KEY `_RecipeIngredient_B_fkey`;

-- DropForeignKey
ALTER TABLE `recipe` DROP FOREIGN KEY `Recipe_userId_fkey`;

-- DropIndex
DROP INDEX `Diet_name_key` ON `diet`;

-- DropIndex
DROP INDEX `Ingredient_name_key` ON `ingredient`;

-- DropIndex
DROP INDEX `Recipe_userId_key` ON `recipe`;

-- DropTable
DROP TABLE `_recipediet`;

-- DropTable
DROP TABLE `_recipeingredient`;

-- CreateTable
CREATE TABLE `_IngredientToRecipe` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_IngredientToRecipe_AB_unique`(`A`, `B`),
    INDEX `_IngredientToRecipe_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DietToRecipe` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DietToRecipe_AB_unique`(`A`, `B`),
    INDEX `_DietToRecipe_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Recipe_name_userId_key` ON `Recipe`(`name`, `userId`);

-- AddForeignKey
ALTER TABLE `_IngredientToRecipe` ADD CONSTRAINT `_IngredientToRecipe_A_fkey` FOREIGN KEY (`A`) REFERENCES `Ingredient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_IngredientToRecipe` ADD CONSTRAINT `_IngredientToRecipe_B_fkey` FOREIGN KEY (`B`) REFERENCES `Recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DietToRecipe` ADD CONSTRAINT `_DietToRecipe_A_fkey` FOREIGN KEY (`A`) REFERENCES `Diet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DietToRecipe` ADD CONSTRAINT `_DietToRecipe_B_fkey` FOREIGN KEY (`B`) REFERENCES `Recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;