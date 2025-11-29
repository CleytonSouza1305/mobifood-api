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
        menu: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 20
        }
      }
    })

    const avaliationTotal = restaurant?.comments.reduce((acc, n) => acc + n.rating, 0)
    const media = Number(avaliationTotal) / Number(restaurant?.comments.length)

    if (!restaurant) return null

    return {
      avaliation: media,
      ...restaurant
    }
  }

  static commentRestaurant = async (restaurantId: number, userId: number, rating: number, commentText: string) => {
    const comment = await prisma.comments.create({
      data: {
        comment: commentText,
        rating,
        restaurantId,
        userId
      }
    })

    return comment
  }
} 