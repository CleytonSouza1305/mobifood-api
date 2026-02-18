import { prisma } from "../database"

export type MethodType = 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD'
export type KeyType = 'EMAIL' | 'CPF' | 'PHONE' | 'RANDOMKEY'

interface paymentInterface {
  userId: number,
  method: MethodType,
  isDefault?: boolean,
  brand?: string,
  nameOnCard?: string,
  lastFourDigits?: string,
  expiryMonth?: number,
  expiryYear?: number,
  keyType: KeyType,
  key?: string
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

  static addNewPayment = async (data: paymentInterface) => {
    return await prisma.paymentMethods.create({ data }, )
  }
}