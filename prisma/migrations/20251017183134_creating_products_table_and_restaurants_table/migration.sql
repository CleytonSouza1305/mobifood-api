-- CreateEnum
CREATE TYPE "public"."RestaurantCategory" AS ENUM ('FAST_FOOD', 'ITALIAN', 'JAPANESE', 'CHINESE', 'MEXICAN', 'VEGETARIAN', 'PIZZA', 'BURGER', 'SEAFOOD', 'BAKERY', 'COFFEE_SHOP', 'DESSERT', 'OTHERS');

-- CreateEnum
CREATE TYPE "public"."ProductCategory" AS ENUM ('BURGER', 'PIZZA', 'SUSHI', 'SANDWICH', 'DRINK', 'DESSERT', 'SALAD', 'SOUP', 'SNACK', 'BREAKFAST', 'VEGAN', 'VEGETARIAN', 'OTHERS');

-- CreateTable
CREATE TABLE "public"."Restaurants" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "category" "public"."RestaurantCategory" NOT NULL DEFAULT 'OTHERS',
    "local" VARCHAR(255) NOT NULL,
    "openAt" VARCHAR(10) NOT NULL DEFAULT '10:00',
    "closeAt" VARCHAR(10) NOT NULL DEFAULT '22:00',
    "logoUrl" VARCHAR(255) NOT NULL,

    CONSTRAINT "Restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "category" "public"."ProductCategory" NOT NULL DEFAULT 'OTHERS',
    "price" DECIMAL(10,2) NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Products" ADD CONSTRAINT "Products_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "public"."Restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
