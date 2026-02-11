/*
  Warnings:

  - You are about to drop the column `details` on the `payment_methods` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."KeyType" AS ENUM ('EMAIL', 'CPF', 'PHONE', 'RANDOMKEY');

-- AlterTable
ALTER TABLE "public"."payment_methods" DROP COLUMN "details";

-- CreateTable
CREATE TABLE "public"."CardDetails" (
    "id" SERIAL NOT NULL,
    "brand" VARCHAR(255) NOT NULL,
    "nameOnCard" VARCHAR(100) NOT NULL,
    "lastFourDigits" VARCHAR(100) NOT NULL,
    "expiryMonth" INTEGER NOT NULL,
    "expiryYear" INTEGER NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PixDetails" (
    "id" SERIAL NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "keyType" "public"."KeyType" NOT NULL DEFAULT 'RANDOMKEY',
    "key" VARCHAR(255) NOT NULL,

    CONSTRAINT "PixDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CardDetails" ADD CONSTRAINT "CardDetails_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PixDetails" ADD CONSTRAINT "PixDetails_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
