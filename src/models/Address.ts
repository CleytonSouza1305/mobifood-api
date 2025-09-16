import { prisma } from "../database";
import { AddressRole } from "../generated/prisma";

interface AddressData {
  street?: string;
  city?: string;
  number?: string;
  state?: string;
  role?: AddressRole;
  isActive?: Boolean;
}

export class Address {
  static addressByUserId = async (userId: number) => {
    const address = await prisma.addressUser.findMany({
      where: { userId },
      include: { address: true },
    });

    return address.map((add) => add.address);
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
          users: { some: { userId } },
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
        users: {
          create: { userId: userId },
        },
      },
    });

    return newAddress;
  };

  static addressById = async (addressId: number) => {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    return address;
  };

  static deleteAddress = async (userId: number, addressId: number) => {
    await prisma.addressUser.deleteMany({
      where: { addressId, userId },
    });

    const deletedAddress = await prisma.address.delete({
      where: { id: addressId },
    });

    if (deletedAddress.isActive) {
      const anotherAddress = await prisma.address.findFirst({
        where: {
          users: { some: { userId } },
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
}
