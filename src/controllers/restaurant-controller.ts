import { Handler } from "express";
import { Restaurant, restaurantFilter } from "../models/Restaurant";
import { HttpError } from "../error/HttpError";
import { RestaurantCategory } from "../generated/prisma";

// GET /api/restaurant
const allRestaurants: Handler = async (req, res, next) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      name,
      category,
      sortBy = "createdAt",
      order = "asc",
    } = req.query;

    const pageSizeNumber = Number(pageSize);
    const pageNumber = Number(page);

    const filter: restaurantFilter = {
      page: (pageNumber - 1) * pageSizeNumber,
      pageSize: pageSizeNumber,
      where: {},
      sortBy: String(sortBy),
      order: order === "desc" ? "desc" : "asc",
    };

    if (name) {
      filter.where.name = {
        contains: String(name),
        mode: "insensitive",
      };
    }
      
    if (category) {
      filter.where.category = { equals: String(category).toUpperCase() as RestaurantCategory };
    }

    const restaurants = await Restaurant.AllRestaurant(filter);
    res.json({
      data: restaurants.data,
      total: restaurants.total,
      pages: restaurants.total / pageSizeNumber
    });
  } catch (error) {
    next(error);
  }
};

const restaurantById: Handler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.onlyRestaurant(+id);
    if (!restaurant) {
      throw new HttpError(404, "Restaurante não encontrado.");
    }

    res.json(restaurant);
  } catch (error) {
    next(error);
  }
};

export { allRestaurants, restaurantById };
