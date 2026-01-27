/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Area` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Area` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Area" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Area_id_userId_key" ON "Area"("id", "userId");
