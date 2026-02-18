/*
  Warnings:

  - You are about to drop the `CardDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PixDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."CardDetails" DROP CONSTRAINT "CardDetails_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PixDetails" DROP CONSTRAINT "PixDetails_paymentId_fkey";

-- AlterTable
ALTER TABLE "public"."PaymentMethods" ADD COLUMN     "brand" VARCHAR(255),
ADD COLUMN     "expiryMonth" INTEGER,
ADD COLUMN     "expiryYear" INTEGER,
ADD COLUMN     "key" VARCHAR(255),
ADD COLUMN     "keyType" "public"."KeyType" DEFAULT 'RANDOMKEY',
ADD COLUMN     "lastFourDigits" VARCHAR(100),
ADD COLUMN     "nameOnCard" VARCHAR(100);

-- DropTable
DROP TABLE "public"."CardDetails";

-- DropTable
DROP TABLE "public"."PixDetails";
