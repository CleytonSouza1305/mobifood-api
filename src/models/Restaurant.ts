import { prisma } from "../database"

export class Restaurant {
  static AllRestaurant = async () => {
    const restaurants = await prisma.restaurants.findMany()
    return restaurants
  }

  static onlyRestaurant = async (id: number) => {
    const restaurant = await prisma.restaurants.findUnique({
      where: { id },
      include: {
        menu: true
      }
    })

    return restaurant
  }
} 