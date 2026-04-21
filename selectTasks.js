import { prisma } from "./lib/prisma.js";

const allTasks = await prisma.task.findMany()

console.log(`Total tasks: ${allTasks.length}, Tasks:`, allTasks)