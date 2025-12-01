import { Handler } from "express";
import { Restaurant, restaurantFilter } from "../models/Restaurant";
import { HttpError } from "../error/HttpError";
import { RestaurantCategory } from "../generated/prisma";
import { User } from "../models/User";
import { CreateCommentRequestSchema } from "../schema/UserRequest";
import { ZodError } from "zod";
import { JwtPayload } from "jsonwebtoken";

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
      filter.where.category = {
        equals: String(category).toUpperCase() as RestaurantCategory,
      };
    }

    const restaurants = await Restaurant.AllRestaurant(filter);
    res.json({
      data: restaurants.data,
      total: restaurants.total,
      pages: restaurants.total / pageSizeNumber,
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

const commentRestaurantReq: Handler = async (req, res, next) => {
  try {
    const userId = +req.params.userId;
    const restaurantId = +req.params.id;

    const existsUser = await User.findById(userId);
    if (!existsUser) {
      throw new HttpError(404, "Usuário não encontrado.");
    }

    const existRestaurant = await Restaurant.onlyRestaurant(restaurantId);
    if (!existRestaurant) {
      throw new HttpError(404, "Restaurante não encontrado.");
    }

    const body = CreateCommentRequestSchema.parse(req.body);
    if (body.rating < 1 || body.rating > 5) {
      throw new HttpError(
        400,
        "A nota deve ser maior que 1 e menor que 5 estrelas."
      );
    }

    if (!req.isAutorizated) {
      throw new HttpError(401, "Usuário não autenticado.");
    }

    if (!req.user || typeof req.user !== "object" || !("id" in req.user)) {
      throw new HttpError(401, "Usuário não autenticado.");
    }
    const user = req.user as JwtPayload & { id: number; role: string };

    if (+user.id !== userId && user.role !== "admin") {
      throw new HttpError(403, "Acesso negado.");
    }

    const restaurantComments = existRestaurant.comments;

    const existComment = restaurantComments.filter((c) => c.userId === user.id);

    if (existComment.length > 0) {
      throw new HttpError(400, "Você já possui um comentário registrado.");
    }

    const comment = await Restaurant.commentRestaurant(restaurantId, userId, body.rating, body.comment);
    res.json(comment);

  } catch (error) {
    if (error instanceof ZodError) {
      const errorFIeld = error.issues.map((el) => el.path.join(".")).join(", ");

      if (errorFIeld.includes("rating")) {
        throw new HttpError(400, "A nota do estabelecimento é obrigatória.");
      } else if (errorFIeld.includes("comment")) {
        throw new HttpError(
          400,
          "O comentário deve ter mais de 3 caracteres e menor que 300."
        );
      } else {
        next(error);
      }
    } else {
      next(error);
    }
  }
};

export { allRestaurants, restaurantById, commentRestaurantReq };
