/*
  Warnings:

  - You are about to drop the `payment_methods` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."CardDetails" DROP CONSTRAINT "CardDetails_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PixDetails" DROP CONSTRAINT "PixDetails_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."payment_methods" DROP CONSTRAINT "payment_methods_userId_fkey";

-- DropTable
DROP TABLE "public"."payment_methods";

-- DropEnum
DROP TYPE "public"."PaymentType";

-- CreateTable
CREATE TABLE "public"."PaymentMethods" (
    "id" SERIAL NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethods_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PaymentMethods" ADD CONSTRAINT "PaymentMethods_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CardDetails" ADD CONSTRAINT "CardDetails_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."PaymentMethods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PixDetails" ADD CONSTRAINT "PixDetails_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."PaymentMethods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
