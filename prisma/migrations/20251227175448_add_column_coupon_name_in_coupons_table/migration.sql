/*
  Warnings:

  - Added the required column `couponName` to the `Coupons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Coupons" ADD COLUMN     "couponName" VARCHAR(255) NOT NULL;
