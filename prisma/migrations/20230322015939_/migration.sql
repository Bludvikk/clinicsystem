/*
  Warnings:

  - The primary key for the `Patient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `address` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `civilStatusId` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `familyHistory` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genderId` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `obGyne` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occupationId` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pastMedicalHistory` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personalHistory` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_pkey",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "civilStatusId" INTEGER NOT NULL,
ADD COLUMN     "contactNumber" TEXT DEFAULT 'N/A',
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "familyHistory" JSONB NOT NULL,
ADD COLUMN     "genderId" INTEGER NOT NULL,
ADD COLUMN     "middleInitial" TEXT DEFAULT 'N/A',
ADD COLUMN     "obGyne" JSONB NOT NULL,
ADD COLUMN     "occupationId" INTEGER NOT NULL,
ADD COLUMN     "pastMedicalHistory" JSONB NOT NULL,
ADD COLUMN     "personalHistory" JSONB NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Patient_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Patient_id_seq";

-- CreateTable
CREATE TABLE "CivilStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CivilStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Occupation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Occupation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gender" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Gender_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_civilStatusId_fkey" FOREIGN KEY ("civilStatusId") REFERENCES "CivilStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_occupationId_fkey" FOREIGN KEY ("occupationId") REFERENCES "Occupation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
