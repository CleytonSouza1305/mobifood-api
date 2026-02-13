import { prisma } from "../database"

interface paymentInterface {
  id?: number
  userId?: number
}

export class Payment {
  static paymentByUserId = async (userId: number) => {
    return await prisma.paymentMethods.findMany({ 
      where: { 
        userId 
      },
      include: {
        pixDetails: {},
        cardDetails: {}
      }
    })
  }

  static addNewPayment = async (userId: number, data: paymentInterface) => {
    
  }
}