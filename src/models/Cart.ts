import { prisma } from "../database";

export class Cart {
  static cartById = async (cartId: number) => {
    const cart = await prisma.cart.findUnique({
      where: {
        id: cartId,
      },
      include: {
        items: {
          include: { item: true },
        },
      },
    });
    return cart;
  };

  static addItemToCart = async (
    cartId: number,
    itemId: number,
    quantity: number
  ) => {
    const product = await prisma.products.findUnique({ where: { id: itemId } });
    if (!product) return

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: { item: true },
        },
      },
    });

    const existsItem = cart?.items.find((i) => i.itemId === product.id);
    if (existsItem) {
      await prisma.cartItem.update({
        where: { id: existsItem.id },
        data: {
          quantity: existsItem.quantity + quantity,
          subTotal: +product.price * (existsItem.quantity + quantity),
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId,
          itemId,
          quantity,
          subTotal: +product.price * quantity,
        },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });

    const total = updatedCart?.items.reduce(
      (acc, item) => acc + (item.subTotal ?? 0),
      0
    );

    await prisma.cart.update({
      where: { id: cartId },
      data: { total },
    });

    return await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  };

  static updateItemCart = async (
    cartId: number,
    itemId: number,
    quantity: number
  ) => {
    const product = await prisma.products.findUnique({
      where: { id: itemId },
    });

    if (!product) {
      return { message: "Product not found." };
    }

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: true,
      },
    });

    if (!cart) {
      return { message: "Cart not found." };
    }

    const existsItem = cart.items.find((i) => i.itemId === itemId);
    if (!existsItem) {
      return { message: "Item not found in cart." };
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: existsItem.id },
      });
    } else {
      await prisma.cartItem.update({
        where: { id: existsItem.id },
        data: {
          quantity,
          subTotal: Number(product.price) * quantity,
        },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: { item: true },
        },
      },
    });

    const total = updatedCart!.items.reduce(
      (acc, item) => acc + (item.subTotal ?? 0),
      0
    );

    return await prisma.cart.update({
      where: { id: cartId },
      data: { total },
      include: {
        items: {
          include: { item: true },
        },
      },
    });
  };

  static removeItemFromCart = async (cartId: number, itemId: number) => {
    const product = await prisma.products.findUnique({ where: { id: itemId } });
    if (!product) {
      return { message: `Product not found.` };
    }

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: { item: true },
        },
      },
    });

    if (!cart) {
      return { message: "Cart not found." };
    }

    const existsItem = cart?.items.find((i) => i.itemId === product.id);
    if (!existsItem) return { message: "Item not found in cart." };

    await prisma.cartItem.delete({
      where: { id: existsItem.id },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });

    const total = updatedCart?.items.reduce(
      (acc, item) => acc + (item.subTotal ?? 0),
      0
    );

    return await prisma.cart.update({
      where: { id: cartId },
      data: { total },
      include: {
        items: {
          include: { item: true },
        },
      },
    });
  };
}
