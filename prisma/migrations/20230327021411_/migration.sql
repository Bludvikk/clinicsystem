/*
  Warnings:

  - Made the column `fieldProp` on table `Entity` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Entity" ALTER COLUMN "fieldProp" SET NOT NULL;
