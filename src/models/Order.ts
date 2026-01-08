import { prisma } from "../database"

type EnumStatus = 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'

export interface CreateOrderInterface {
  userId: number           
  totalOriginal: number       
  totalDiscounted: number     
  deliveryFee?: number         
  deliveryAddress: string      
  paymentMethod: string      
  status: EnumStatus          
}

export class Order {
  static createOrder = async (data: CreateOrderInterface) => {
    return await prisma.order.create({ data })
  }

  static ordersByUserId = async (userId: number) => {
    const orders = await prisma.order.findMany({ where: { userId} })
  }
}