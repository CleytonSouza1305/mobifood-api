import { Handler } from "express";
import { Restaurant } from "../models/Restaurant";
import { HttpError } from "../error/HttpError";

// GET /api/restaurant
const allRestaurants: Handler = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.AllRestaurant();
    res.json(restaurants);
  } catch (error) {
    next(error);
  }
};

const restaurantById: Handler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.onlyRestaurant(+id);
    if (!restaurant) {
      throw new HttpError(404, 'Restaurante não encontrado.')
    }

    res.json(restaurant)
  } catch (error) {
    next(error);
  }
};

export { allRestaurants, restaurantById };
