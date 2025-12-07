import { prisma } from "../database"

export class Cart {
  static cartById = async (cartId: number) => {
    const cart = await prisma.cart.findUnique({ 
      where: {
         id: cartId 
        },
        include: {
          items: {
            include:  { item: true }
          }
        }
    })
    return cart
  }

  static addItemToCart = async (cartId: number, itemId: number, quantity: number) => {
    const product = await prisma.products.findUnique({ where: { id: itemId } })
    if (!product) {
      return { message: `Product not found.`}
    }

    const newItem = await prisma.cartItem.createMany({
      data: {
        cartId,
        itemId,
        quantity,
        subTotal: +product.price * quantity
      }
    })

    return newItem
  }
}