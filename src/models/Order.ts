import { promises } from "dns";
import { prisma } from "../database";
import { ProductCategory } from "../generated/prisma";

type EnumStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface CreateOrderInterface {
  userId: number;
  totalOriginal: number;
  totalDiscounted?: number;
  deliveryFee?: number;
  deliveryAddress: string;
  paymentMethod: string;
  status?: EnumStatus;
}

export interface cartItemArr {
  id: number;
  cartId: number;
  itemId: number;
  quantity: number;
  subTotal: number | null;
  item: {
    id: number;
    name: string;
    category: ProductCategory;
    price: any; 
    restaurantId: number;
    description: string;
    imageUrl: string | null;
  };
}

export class Order {
  static createOrder = async (
    data: CreateOrderInterface,
    cartProducts: cartItemArr[]
  ) => {
    const { userId, ...orderData } = data;

    const newOrder = await prisma.order.create({
      data: {
        ...orderData,
        user: {
          connect: { id: userId },
        },
      },
    });

    await Promise.all(
      cartProducts.map((product) =>
        prisma.orderItem.create({
          data: {
            priceAtOrder: Number(product.item.price), 
            productId: product.item.id,
            orderId: newOrder.id, 
            quantity: product.quantity,
          },
        })
      )
    );

    return newOrder;
  };

  static ordersByUserId = async (userId: number) => {
    const orders = await prisma.order.findMany({ where: { userId } });
    return orders;
  };
}
