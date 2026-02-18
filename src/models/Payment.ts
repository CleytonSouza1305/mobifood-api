import { prisma } from "../database"

interface paymentInterface {
  id?: number
  userId?: number
}

export class Payment {
  static paymentByUserId = async (userId: number) => {
  const paymentMethods = await prisma.paymentMethods.findMany({ 
    where: { userId }, 
    orderBy: { method: "asc" }
  });

  return paymentMethods.map(pm => {
    const { id, userId, isDefault, method, createdAt, updatedAt, ...rest } = pm;
  
    const base = { id, userId, method, isDefault, createdAt, updatedAt };

    if (method === 'PIX') {
      return { 
        ...base, 
        key: rest.key, 
        keyType: rest.keyType 
      };
    }

    return { 
      ...base, 
      brand: rest.brand, 
      nameOnCard: rest.nameOnCard,
      lastFourDigits: rest.lastFourDigits,
      expiryMonth: rest.expiryMonth,
      expiryYear: rest.expiryYear
    };
  });
}

  static addNewPayment = async (userId: number, data: paymentInterface) => {
    
  }
}