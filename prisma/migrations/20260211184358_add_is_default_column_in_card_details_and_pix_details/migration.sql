/*
  Warnings:

  - You are about to drop the column `isDefault` on the `PaymentMethods` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."CardDetails" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."PaymentMethods" DROP COLUMN "isDefault";

-- AlterTable
ALTER TABLE "public"."PixDetails" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;
