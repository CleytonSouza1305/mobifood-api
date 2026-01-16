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

function getHour(time: string): number {
  return Number(time.split(':')[0]);
}

async function validateProductAndRestaurant(
  productId: number
) {
  const product = await prisma.products.findUnique({
    where: { id: productId },
    include: {
      restaurant: true,
    },
  });

  console.log(product)

  if (!product) throw new HttpError(404, "Product not found.");

  const restaurant = product.restaurant;

  if (!restaurant) throw new HttpError(404, "Restaurant not found.");

  if (
    !isRestaurantOpen(getHour(restaurant.openAt), getHour(restaurant.closeAt))
  ) {
    throw new HttpError(
      400,
      `Não foi possível inserir "${product.name}" ao carrinho, "${restaurant.name}" se encontra fechado.`
    );
  }

  return true
}

export { validateProductAndRestaurant, getHour, isRestaurantOpen };
