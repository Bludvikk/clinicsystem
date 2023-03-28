/*
  Warnings:

  - Made the column `contactNumber` on table `Patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `middleInitial` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "contactNumber" SET NOT NULL,
ALTER COLUMN "middleInitial" SET NOT NULL;
