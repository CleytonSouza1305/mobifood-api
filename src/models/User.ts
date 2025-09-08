import { prisma } from "../database"

class User {

  static allUsers = async () => {
     const users = await prisma.user.findMany()

     return users
  }
}