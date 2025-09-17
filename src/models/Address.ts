import { prisma } from "../database";
import { AddressRole } from "../generated/prisma";

interface AddressData {
  street?: string;
  city?: string;
  number?: string;
  state?: string;
  role?: AddressRole;
  isActive?: boolean;
}

export class Address {
  static addressByUserId = async (userId: number) => {
    const address = await prisma.address.findMany({
      where: { userId }
    });

    return address
  };

  static createAddress = async (
    userId: number,
    street: string,
    city: string,
    number: string,
    state: string,
    role: AddressRole,
    isActive: boolean
  ) => {
    if (isActive) {
      await prisma.address.updateMany({
        data: { isActive: false },
        where: {
          isActive: true,
          user: { id: userId },
        },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        street,
        city,
        number,
        state,
        role,
        isActive,
        userId
      }
    });

    return newAddress;
  };

  static addressById = async (addressId: number) => {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
      include: {
        user: { select: {
          id: true,
          username: true,
          email: true
        }}
      }
    });

    return address;
  };

  static deleteAddress = async (userId: number, addressId: number) => {

    const deletedAddress = await prisma.address.delete({
      where: { id: addressId },
    });

    if (deletedAddress.isActive) {
      const anotherAddress = await prisma.address.findFirst({
        where: {
          user: { id: userId },
        },
      });

      if (anotherAddress) {
        await prisma.address.update({
          where: { id: anotherAddress.id },
          data: { isActive: true },
        });
      }
    }

    return deletedAddress;
  };

  static updateAddress = async (userId: number, addressId: number, data: AddressData) => {
    if (data.isActive) {
      await prisma.address.updateMany({
        data: { isActive: false },
        where: {
          isActive: true,
          user: { id: userId }
        }
      })
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data
    })

    return updatedAddress
  }
}
