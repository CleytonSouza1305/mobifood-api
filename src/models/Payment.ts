import { prisma } from "../database"
import { PaymentType } from "../generated/prisma"

interface paymentInterface {
  id?: number,
  method?: PaymentType,
  isDefault?: boolean
  userId?: number
}

export class Payment {
  static paymentByUserId = async (userId: number) => {
    return await prisma.paymentMethods.findMany({ where: { userId }})
  }

  static addNewPayment = async (userId: number, data: paymentInterface) => {
    
  }
}