/*
  Warnings:

  - The values [casa,trabalho,escola,outros] on the enum `AddressRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."FavoriteTheme" AS ENUM ('dark', 'light');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."AddressRole_new" AS ENUM ('Casa', 'Trabalho', 'Escola', 'Outros');
ALTER TABLE "public"."Address" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."Address" ALTER COLUMN "role" TYPE "public"."AddressRole_new" USING ("role"::text::"public"."AddressRole_new");
ALTER TYPE "public"."AddressRole" RENAME TO "AddressRole_old";
ALTER TYPE "public"."AddressRole_new" RENAME TO "AddressRole";
DROP TYPE "public"."AddressRole_old";
ALTER TABLE "public"."Address" ALTER COLUMN "role" SET DEFAULT 'Casa';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Address" ALTER COLUMN "role" SET DEFAULT 'Casa';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "favoriteTheme" "public"."FavoriteTheme" NOT NULL DEFAULT 'light';
