import express from 'express'
import { taskServices } from '../services/taskServices.js'
import { middleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/tasks', middleware.authenticate, async (req, res) => {
  const data = req.body
  const user = req.user

  try {
    const task = await taskServices.createTask(
      user.userId,
      data.title,
      data.description,
      data.due_date
    )
    res.status(200).json(task)
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

router.get('/tasks/:userId', middleware.authenticate, async (req, res) => {
  const user_Id = req.params.userId
  const user = req.user

  if (Number(user_Id) === user.userId) {
    try {
      const tasks = await taskServices.getTaskByUserId(Number(user_Id))
      res.status(200).json(tasks)
    } catch (error) {
      res.status(500).json({ error: error })
    }
  } else {
    res.status(403).json({ message: `You are not user ${user_Id}` })
  }
})

router.put('/tasks/:taskId', middleware.authenticate, async (req, res) => {
  const taskId = Number(req.params.taskId)
  const data = req.body
  const user = req.user
  const task = await taskServices.getTaskByTaskId(taskId)
  if (!task) return res.status(404).json({ error: 'message not found' })
  if (task.user_Id === user.userId) {
    try {
      const update = await taskServices.updateTask(taskId, data)
      res.status(200).json(update)
    } catch (err) {
      res.status(500).json({ error: err })
    }
  } else {
    res.status(403).json({ message: `You are not the owner of task ${taskId}` })
  }
})

router.delete('/tasks/:taskId', middleware.authenticate, async (req, res) => {
  const user = req.user
  const taskId = Number(req.params.taskId)

  const task = await taskServices.getTaskByTaskId(taskId)
  if (!task) return res.status(404).json({ error: 'message not found' })
  if (task.user_Id === user.userId) {
    try {
      const deleted = await taskServices.deleteTask(taskId)
      res.status(200).json(deleted)
    } catch (error) {
      if (error.code === 'P2025') {
        res.status(409).json("Task doesn't exist")
      } else {
        res.status(500).json({ error: error })
      }
    }
  } else {
    res.status(403).json({ message: `You are not owner of task ${taskId}` })
  }
})

export { router as taskRoutes }
