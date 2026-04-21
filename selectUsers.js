import { prisma } from "./lib/prisma.js";

const allUsers = await prisma.user.findMany()

console.log(`Total users: ${allUsers.length}, Usuarios:`, allUsers)