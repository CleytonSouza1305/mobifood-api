/*
  Warnings:

  - You are about to drop the `address_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."address_user" DROP CONSTRAINT "address_user_addressId_fkey";

-- DropForeignKey
ALTER TABLE "public"."address_user" DROP CONSTRAINT "address_user_userId_fkey";

-- DropTable
DROP TABLE "public"."address_user";
