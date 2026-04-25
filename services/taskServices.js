import { prisma } from '../lib/prisma.js'
const createTask = async (user_Id, title, description, due_date) => {
  const task = await prisma.task.create({
    data: {
      user_Id,
      title,
      description,
      due_date
    }
  })
  console.log(`Task criada com sucesso: ${JSON.stringify(task)}`)
  return task
}

const getTaskByTaskId = async taskId => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId
    }
  })
  return task
}

const getTaskByUserId = async userId => {
  const tasks = await prisma.task.findMany({
    where: {
      user_Id: userId
    },
    orderBy: {
      created_at: 'desc'
    }
  })
  return tasks
}

const updateTask = async (taskId, data) => {
  const updateTask = await prisma.task.update({
    where: {
      id: taskId
    },
    data: {
      ...data
    }
  })
  return updateTask
}

const deleteTask = async taskId => {
  const deleteTask = await prisma.task.delete({
    where: {
      id: taskId
    }
  })
  console.log(`Task: ${taskId} sucessfully deleted`)
}

export const taskServices = {
  createTask,
  getTaskByUserId,
  updateTask,
  deleteTask,
  getTaskByTaskId
}
