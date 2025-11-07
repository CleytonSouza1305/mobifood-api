import { prisma } from "../database"
import { RestaurantCategory } from "../generated/prisma"

export interface restaurantFilter {
  page: number,
  pageSize: number,
  where: {
      name?: { contains: string, mode: 'insensitive' | 'default' },
      category?: { equals: RestaurantCategory }
    },
    sortBy: string,
    order: 'asc' | 'desc'
}

export class Restaurant {
  static AllRestaurant = async (filter: restaurantFilter) => {
    const restaurants = await prisma.restaurants.findMany({
      where: filter.where,
      take: filter.pageSize,
      skip: filter.page
    })

    const total = await prisma.restaurants.count({ where: filter.where });

    return { data: restaurants, total };
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