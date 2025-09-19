/*
  Warnings:

  - The values [Casa,Trabalho,Escola,Outros] on the enum `AddressRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."AddressRole_new" AS ENUM ('casa', 'trabalho', 'escola', 'outros');
ALTER TABLE "public"."Address" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."Address" ALTER COLUMN "role" TYPE "public"."AddressRole_new" USING ("role"::text::"public"."AddressRole_new");
ALTER TYPE "public"."AddressRole" RENAME TO "AddressRole_old";
ALTER TYPE "public"."AddressRole_new" RENAME TO "AddressRole";
DROP TYPE "public"."AddressRole_old";
ALTER TABLE "public"."Address" ALTER COLUMN "role" SET DEFAULT 'casa';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Address" ALTER COLUMN "role" SET DEFAULT 'casa';
