import { Handler } from "express";
import { User } from "../models/User";
import { HttpError } from "../error/HttpError";
import { Order, orderFilter, statusType } from "../models/Order";
import { CreateOrderRequestSchema } from "../schema/OrderRequest";
import { ZodError } from "zod";
import { Cart } from "../models/Cart";
import { Coupon } from "../models/Coupon";
import calculateDiscount from "../utils/calculateDiscount";
import { Restaurant } from "../models/Restaurant";
import {
  getHour,
  isRestaurantOpen,
} from "../utils/validateProductAndRestaurant";
import { JwtPayload } from "jsonwebtoken";
import { OrderStatus } from "../generated/prisma";

interface OrderStep {
  status: OrderStatus;
  delay: number;
}

// /api/order/user/:id
const ordersByUserId: Handler = async (req, res, next) => {
  try {
    const {
      pageNumber = 1,
      pageSizeNumber = 10,
      sortBy = "createdAt",
      order = "asc",
      status = "PLACED",
    } = req.query;

    const userId = Number(req.params.id);

    const existsUser = await User.findById(userId);
    if (!existsUser) throw new HttpError(404, "Usuário não encontrado.");

    if (!req.user || typeof req.user !== "object" || !("id" in req.user)) {
      throw new HttpError(401, "Usuário não autenticado.");
    }

    if (req.user.id !== userId && req.user.role !== "admin") {
      throw new HttpError(403, "Busca inválida, você não tem permissão.");
    }

    const validStatus: statusType[] = [
      "PLACED",
      "CONFIRMED",
      "PREPARING",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];

    const statusStr = String(status);

    if (!validStatus.includes(statusStr as statusType)) {
      throw new HttpError(400, "Status para query inválido.");
    }

    const finalStatus = statusStr as statusType;

    const filter: orderFilter = {
      sortBy: String(sortBy),
      order: order === "desc" ? "desc" : "asc",
      page: Number(pageNumber),
      pageSize: Number(pageSizeNumber),
      where: {
        userId: Number(req.user.id),
        status: {
          equals: finalStatus,
        },
      },
    };

    const orders = await Order.ordersByUserId(filter);
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

    const uniqueRestaurantIds = [
      ...new Set(cart.items.map((i) => Number(i.item.restaurantId))),
    ];

    const allRestaurants = await Promise.all(
      uniqueRestaurantIds.map(async (id) => {
        const restaurant = await Restaurant.onlyRestaurant(id);
        if (!restaurant)
          throw new HttpError(404, "Restaurante não encontrado.");
        return restaurant;
      }),
    );

    const closedRestaurants = allRestaurants.filter((r) => {
      if (!isRestaurantOpen(getHour(r.openAt), getHour(r.closeAt))) {
        return true;
      } else {
        return false;
      }
    });

    if (closedRestaurants && closedRestaurants.length > 0) {
      const names = [...new Set(closedRestaurants.map((r) => r.name))].join(
        ", \n",
      );
      throw new HttpError(
        400,
        `Pedido cancelado.\n Os seguintes restaurantes estão fechados agora:\n\n ${names}`,
      );
    }

    let totalOriginal = cart.total;
    let totalDiscounted = cart.total;
    let deliveryFee = deliveryTax;

    if (body.couponCode) {
      const isValidCoupon = await Coupon.validadeCouponCode(body.couponCode);

      if (!isValidCoupon) {
        throw new HttpError(404, "Cupom inválido ou expirado.");
      }

      await Coupon.turnCouponUsaged(user.id, isValidCoupon.id);

      const discountPrice = calculateDiscount(
        cart.total,
        isValidCoupon.discountType,
        isValidCoupon.discountValue,
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
      deliveryFee: +deliveryFee,
    };

    const newOrder = await Order.createOrder(data, cart.items);

    await Cart.clearCart(cart.id);

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

// GET /api/order/:orderNumber
const orderByNumber: Handler = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.onlyOrderByOrderNumber("#" + orderNumber);

    if (!req.user || typeof req.user !== "object" || !("id" in req.user)) {
      throw new HttpError(401, "Usuário não autenticado.");
    }

    const user = req.user as JwtPayload & { id: number; role: string };
    if (order?.userId !== user.id && user.role !== "admin") {
      throw new HttpError(403, "User not authorized.");
    }

    if (!order) throw new HttpError(404, "Order não encontrada.");
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// POST /api/order/checkout
const processPayment: Handler = async (req, res, next) => {
  const { orderNumber, paymentMethod, cardDetails } = req.body;

  try {
    const isValidOrder = await Order.onlyOrderByOrderNumber(orderNumber);
    if (!isValidOrder) {
      throw new HttpError(404, "Order não encontrada.");
    }

    if (isValidOrder.status !== "PLACED") {
      throw new HttpError(
        400,
        "Erro ao pagar order, indisponível para efetuar pagamento.",
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (paymentMethod === "CREDIT_CARD") {
      if (cardDetails.number.startsWith("404")) {
        throw new HttpError(402, "Cartão recusado. Saldo insuficiente.");
      }
    }

    await Order.updateOrder(orderNumber, { status: "CONFIRMED" });

    const intervalDt: OrderStep[] = [
      { status: "PREPARING", delay: 10000 },
      { status: "OUT_FOR_DELIVERY", delay: 30000 },
    ];

    intervalDt.forEach((step) => {
      setTimeout(async () => {
        await Order.updateOrder(orderNumber, { status: step.status });
        console.log(`Pedido ${orderNumber} com status alterado para ${step.status} com sucesso!`)
      }, step.delay);
    });

    res.json({ success: true, message: "Pagamento aprovado!" });
  } catch (error) {
    next(error);
  }
};

export { ordersByUserId, createOrder, orderByNumber, processPayment };
