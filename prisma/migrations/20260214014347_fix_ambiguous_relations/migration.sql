/*
  Warnings:

  - You are about to drop the column `isActive` on the `Courier` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `Courier` table. All the data in the column will be lost.
  - You are about to drop the column `isBlocked` on the `Courier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[isInRouterId]` on the table `Courier` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."CourierStatus" AS ENUM ('OFFLINE', 'AVAILABLE', 'DELIVERING', 'SUSPENDED');

-- AlterTable
ALTER TABLE "public"."Courier" DROP COLUMN "isActive",
DROP COLUMN "isAvailable",
DROP COLUMN "isBlocked",
ADD COLUMN     "isInRouterId" INTEGER,
ADD COLUMN     "status" "public"."CourierStatus" NOT NULL DEFAULT 'OFFLINE';

-- CreateIndex
CREATE UNIQUE INDEX "Courier_isInRouterId_key" ON "public"."Courier"("isInRouterId");

-- AddForeignKey
ALTER TABLE "public"."Courier" ADD CONSTRAINT "Courier_isInRouterId_fkey" FOREIGN KEY ("isInRouterId") REFERENCES "public"."Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
