import express from 'express'
import { userServices } from './services/userServices.js'
import { taskServices } from './services/taskServices.js'
import { middleware } from './middleware/auth.js'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
  res.status(200).send('Hello World')
})

app.post('/users', async (req, res) => {
  const data = req.body
  try {
    const user = await userServices.createUser(
      data.name,
      data.email,
      data.password
    )

    const userWithouthPass = {
      name: user.name,
      email: user.email
    }
    res.status(200).json(userWithouthPass)
  } catch (err) {
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'This email is already in use' })
    } else {
      res.status(500).json({ error: `Erro ao criar usuario: ${err}` })
    }
  }
})

app.post('/tasks', middleware.authenticate, async (req, res) => {
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

app.get('/tasks/:userId', middleware.authenticate, async (req, res) => {
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

app.put('/tasks/:taskId', middleware.authenticate, async (req, res) => {
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

app.delete('/tasks/:taskId', middleware.authenticate, async (req, res) => {
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

app.post('/login', async (req, res) => {
  const data = req.body
  try {
    const token = await userServices.loginUser(data.email, data.password)
    res.status(200).json(token)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/me', middleware.authenticate, async (req, res) => {
  try {
    const userId = req.user.userId
    const user = await userServices.findUser(userId)
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
app.listen(3000, () => {
  console.log('server is listening on port 3000...')
})
