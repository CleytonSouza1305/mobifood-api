import { prisma } from "../database"
import { AddressRole } from "../generated/prisma"

interface AddressData {
  street?: string,     
  city?: string,   
  number?: string,  
  state?: string,   
  role?: AddressRole
  isActive?: Boolean  
}

export class Address {
   static addressByUserId = async (userId: number) => {
    const address = await prisma.addressUser.findMany({
      where: { userId },
      include: { address: true }
    })
 
    return address.map((add) => add.address)
  }

  static createAddress = async (userId: number, street:string, city:string, 
    number:string, state:string, role:AddressRole, isActive:boolean) => {

    if (isActive) {
      await prisma.address.updateMany({
        data: { isActive: false },
        where: { 
          isActive: true,
          users: { some: { userId } }
         }
      })
    }

    const newAddress = await prisma.address.create({
      data: {
        street,
        city,
        number,
        state, 
        role,
        isActive,
        users: {
          create: { userId }
        }
      },
      include: { users: true }
    })

    return newAddress
  } 

  static addressById = async (userId: number, addressId: number) => {
    const address = await prisma.address.findUnique({
      where: { id: addressId }
    })

    return address
  }
}