import { prisma } from "../database";
import { UserRole } from "../generated/prisma";

interface UserInfo {
  email?: string;
  username?: string;
  phone?: string;
  role?: UserRole;
  password?: string
}

export interface userFilter {
  page: number,
  pageSize: number,
  where: {
    username?: { contains: string, mode: 'insensitive' | 'default' },
    role?: { equals: UserRole }
  },
  sortBy: string,
  order: 'asc' | 'desc'
}

export class User {
  static allUsers = async (filter: userFilter) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      where: filter.where
    });

    const total = await prisma.user.count({ where: filter.where });

    return { data: users, total };
  };

  static findByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  };

  static findById = async (id: number) => {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        favoriteTheme: true,
        createdAt: true,
        updatedAt: true,
        address: true,
        paymentMethods: true,
        cart: {
          include: {
            items: {
              include: {
                item: true
              }
            }
          }
        }
      },
    });

    if (!user) return null;

    return user
  };

  static createUser = async (
    username: string,
    email: string,
    password: string,
    phone: string,
    role: UserRole
  ) => {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password,
        phone,
        role
      },
    });

    return newUser;
  };

  static updateUser = async (data: UserInfo, id: number) => {
    const updatedUser = await prisma.user.update({
      data,
      where: { id },
    });

    return updatedUser;
  };

  static deleteUser = async (id: number) => {
    const deletedUser = await prisma.user.delete({ where: { id } });

    return deletedUser;
  };
}
