/*
  Warnings:

  - Added the required column `comment` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Comments" ADD COLUMN     "comment" TEXT NOT NULL;
