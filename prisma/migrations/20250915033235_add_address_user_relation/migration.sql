/*
  Warnings:

  - You are about to drop the column `userId` on the `Address` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Address" DROP CONSTRAINT "Address_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Address" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "password" SET DATA TYPE TEXT,
ALTER COLUMN "phone" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."address_user" (
    "userId" INTEGER NOT NULL,
    "addressId" INTEGER NOT NULL,

    CONSTRAINT "address_user_pkey" PRIMARY KEY ("userId","addressId")
);

-- AddForeignKey
ALTER TABLE "public"."address_user" ADD CONSTRAINT "address_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."address_user" ADD CONSTRAINT "address_user_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
