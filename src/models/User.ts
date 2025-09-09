import { prisma } from "../database"

export class User {
  static allUsers = async () => {
     const users = await prisma.user.findMany()

     return users
  }
}