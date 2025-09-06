/*
  Warnings:

  - You are about to drop the column `isActive` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `doctors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."doctors" DROP COLUMN "isActive",
DROP COLUMN "isVerified";
