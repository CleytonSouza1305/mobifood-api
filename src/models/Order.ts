import { prisma } from "../database";
import { ProductCategory } from "../generated/prisma";
import { customAlphabet, nanoid } from "nanoid";

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

export interface UpdateOrderInterface {
  userId?: number;
  totalOriginal?: number;
  totalDiscounted?: number;
  deliveryFee?: number;
  deliveryAddress?: string;
  paymentMethod?: string;
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

export type statusType =
  | "PLACED"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface orderFilter {
  sortBy: string;
  page: number;
  pageSize: number;
  where: {
    userId: number;
    status: { equals: statusType };
  };
  order: "asc" | "desc";
}

async function generateUniqueDisplayId() {
  let isUnique = false;
  let code = "";

  const customWorld = "23456789ABCDEFGHJKMNOPQRSTUVWXYZ";
  const nanoid = customAlphabet(customWorld, 6);

  while (!isUnique) {
    code = nanoid();

    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber: code },
      select: { id: true },
    });

    if (!existingOrder) {
      isUnique = true;
    }
  }

  return code;
}

export class Order {
  static createOrder = async (
    data: CreateOrderInterface,
    cartProducts: cartItemArr[],
  ) => {
    const { userId, ...orderData } = data;
    const uniqueOrderNumber = await generateUniqueDisplayId();

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 15);

    const newOrder = await prisma.order.create({
      data: {
        ...orderData,
        expiresAt: expirationTime,
        orderNumber: `#${uniqueOrderNumber}`,
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
        }),
      ),
    );

    return newOrder;
  };

  static ordersByUserId = async (filter: orderFilter) => {
    await prisma.order.updateMany({
      where: {
        status: "PLACED",
        expiresAt: { lt: new Date() },
      },
      data: {
        status: "CANCELLED",
      },
    });

    const [orders, count] = await prisma.$transaction([
      prisma.order.findMany({
        where: filter.where,
        select: {
          createdAt: true,
          deliveryAddress: true,
          orderNumber: true,
          deliveryFee: true,
          status: true,
          paymentMethod: true,
          totalDiscounted: true,
          totalOriginal: true,
          expiresAt: true,
        },
        orderBy: {
          [filter.sortBy]: filter.order,
        },
        skip: (filter.page - 1) * filter.pageSize,
        take: filter.pageSize,
      }),
      prisma.order.count({ 
        skip: (filter.page - 1) * filter.pageSize,
        take: filter.pageSize,
        orderBy: {
          [filter.sortBy]: filter.order,
        },
        where: filter.where
      })
    ]);

    return {
      orders,
      count,
      page: filter.page,
      pageSize: filter.pageSize
    };
  };

  static onlyOrderByOrderNumber = async (orderNumber: string) => {
    return await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            item: { select: { name: true, imageUrl: true } },
          },
        },
      },
    });
  };

  static updateOrder = async (orderNumber: string, data: UpdateOrderInterface) => {
    const updatedOrder = await prisma.order.update({
      where: { orderNumber },
      data
    })

    return updatedOrder
  }
}
