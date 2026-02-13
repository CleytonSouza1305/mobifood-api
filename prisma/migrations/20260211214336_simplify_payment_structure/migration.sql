/*
  Warnings:

  - Added the required column `method` to the `PaymentMethods` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PaymentType" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'PIX');

-- AlterTable
ALTER TABLE "public"."PaymentMethods" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "method" "public"."PaymentType" NOT NULL;
