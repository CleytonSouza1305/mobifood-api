-- CreateEnum
CREATE TYPE "public"."discountTypeEnum" AS ENUM ('FIXED', 'PERCENTAGE');

-- CreateTable
CREATE TABLE "public"."Coupons" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "discountType" "public"."discountTypeEnum" NOT NULL DEFAULT 'FIXED',
    "discountValue" DECIMAL(10,2) NOT NULL,
    "usageLimit" INTEGER,
    "userUsageLimit" INTEGER NOT NULL DEFAULT 1,
    "startsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UsageCoupon" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "couponId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageCoupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coupons_code_key" ON "public"."Coupons"("code");

-- CreateIndex
CREATE UNIQUE INDEX "UsageCoupon_userId_couponId_key" ON "public"."UsageCoupon"("userId", "couponId");

-- AddForeignKey
ALTER TABLE "public"."UsageCoupon" ADD CONSTRAINT "UsageCoupon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsageCoupon" ADD CONSTRAINT "UsageCoupon_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "public"."Coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
