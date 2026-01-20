import { Handler } from "express";
import { User } from "../models/User";
import { HttpError } from "../error/HttpError";
import { Order } from "../models/Order";
import { CreateOrderRequestSchema } from "../schema/OrderRequest";
import { ZodError } from "zod";
import { Cart } from "../models/Cart";
import { Coupon } from "../models/Coupon";
import calculateDiscount from "../utils/calculateDiscount";
import { Restaurant } from "../models/Restaurant";
import { getHour, isRestaurantOpen } from "../utils/validateProductAndRestaurant";

// /api/order/user/:id
const ordersByUserId: Handler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    const existsUser = await User.findById(userId);
    if (!existsUser) throw new HttpError(404, "Usuário não encontrado.");

    if (!req.user || typeof req.user !== "object" || !("id" in req.user)) {
      throw new HttpError(401, "Usuário não autenticado.");
    }

    if (req.user.id !== userId && req.user.role !== "admin") {
      throw new HttpError(403, "Busca inválida, você não tem permissão.");
    }

    const orders = await Order.ordersByUserId(userId);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// POST /api/order
const createOrder: Handler = async (req, res, next) => {
  try {
    const body = CreateOrderRequestSchema.parse(req.body);
    const deliveryTax = 15;

    if (!req.user || typeof req.user !== "object" || !("id" in req.user)) {
      throw new HttpError(401, "Usuário não autenticado.");
    }

    const user = await User.findById(req.user.id);
    if (!user) throw new HttpError(401, "Usuário não cadastrado.");

    const cart = await Cart.cartById(Number(user.cart?.id));
    if (!cart || cart.items.length <= 0) {
      throw new HttpError(400, "Carrinho vazio ou não encontrado.");
    }

    const uniqueRestaurantIds = [...new Set(cart.items.map(i => Number(i.item.restaurantId)))];

    const allRestaurants = await Promise.all(
      uniqueRestaurantIds.map(async (id) => {
        const restaurant = await Restaurant.onlyRestaurant(id);
        if (!restaurant) throw new HttpError(404, "Restaurante não encontrado.");
        return restaurant;
      })
    );

    const closedRestaurants = allRestaurants.filter((r) => {
      if (
          !isRestaurantOpen(getHour(r.openAt), getHour(r.closeAt))
        ) {
          return true
        } else {
          return false
        }
    });

    if (closedRestaurants && closedRestaurants.length > 0) {
      const names = [...new Set(closedRestaurants.map(r => r.name))].join(", \n")
      throw new HttpError(400, `Pedido cancelado.\n Os seguintes restaurantes estão fechados agora:\n\n ${names}`);
    }

    let totalOriginal = cart.total;
    let totalDiscounted = cart.total;
    let deliveryFee = deliveryTax;

    if (body.couponCode) {
      const isValidCoupon = await Coupon.validadeCouponCode(body.couponCode);

      if (!isValidCoupon) {
        throw new HttpError(404, "Cupom inválido ou expirado.");
      }

      

      await Coupon.turnCouponUsaged(user.id, isValidCoupon.id)

      const discountPrice = calculateDiscount(
        cart.total,
        isValidCoupon.discountType,
        isValidCoupon.discountValue
      );

      totalDiscounted = Number(discountPrice);

      deliveryFee = isValidCoupon.discountType === "DELIVERY" ? 0 : deliveryTax;
    }

    const data = {
      deliveryAddress: body.deliveryAddress,
      paymentMethod: body.paymentMethod,
      userId: user.id,
      totalOriginal: +totalOriginal,
      totalDiscounted: +totalDiscounted + deliveryFee,
      deliveryFee: +deliveryFee
    };

    const newOrder = await Order.createOrder(data, cart.items);
    res.status(201).json(newOrder);
  } catch (error) {
    if (error instanceof ZodError) {
      const errorField = error.issues.map((el) => el.path.join(".")).join(", ");

      let message = `Erro de validação nos campos: ${errorField}`;
      if (errorField.includes("deliveryAddress"))
        message = "Endereço obrigatório.";
      if (errorField.includes("paymentMethod"))
        message = "Método de pagamento obrigatório.";

      res.status(400).json({ message });
    } else {
      next(error);
    }
  }
};

export { ordersByUserId, createOrder };
