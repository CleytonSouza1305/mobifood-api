/*
  Warnings:

  - You are about to drop the column `address` on the `Address` table. All the data in the column will be lost.
  - Added the required column `city` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Address" DROP COLUMN "address",
ADD COLUMN     "city" VARCHAR(100) NOT NULL,
ADD COLUMN     "number" VARCHAR(20) NOT NULL,
ADD COLUMN     "state" VARCHAR(100) NOT NULL,
ADD COLUMN     "street" VARCHAR(255) NOT NULL;
