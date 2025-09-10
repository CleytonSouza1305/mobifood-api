import { prisma } from "../database"
import { UserRole } from "../generated/prisma"

export class User {
  static allUsers = async () => {
     const users = await prisma.user.findMany()

     return users
  }

  static findByEmail = async (email:string) => {
    const user = await prisma.user.findUnique({
      where: { email}
    })

    return user
  }

  static createUser = async (username:string, email:string, password:string, phone:string, role:UserRole) => {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password,
        phone,
        role
      }
    })

    return newUser
  }
}