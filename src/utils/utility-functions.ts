import { prisma } from "../database";
import { HttpError } from "../error/HttpError";

function isRestaurantOpen(openAt: number, closeAt: number): boolean {
  const currentHour = new Date().getHours();

  // fecha no mesmo dia
  if (openAt < closeAt) {
    return currentHour >= openAt && currentHour < closeAt;
  }

  // fecha depois da meia-noite (ex: 18 -> 2)
  return currentHour >= openAt || currentHour < closeAt;
}

async function validateProductAndRestaurant(
  productId: number,
  restaurantId: number
) {
  const product = await prisma.products.findUnique({
    where: { id: productId },
    include: {
      restaurant: true,
    },
  });

  if (!product) throw new HttpError(404, "Product not found.");

  const restaurant = product.restaurant;

  if (!restaurant) throw new HttpError(404, "Restaurant not found.");

  if (product.restaurantId !== restaurantId) {
    throw new HttpError(
      400,
      "This product does not belong to this restaurant."
    );
  }

  if (
    !isRestaurantOpen(Number(restaurant.openAt), Number(restaurant.closeAt))
  ) {
    throw new HttpError(
      400,
      "Unable to add item to cart, the restaurant is closed."
    );
  }

  return {
    product,
    restaurant,
  };
}

export { validateProductAndRestaurant };
