import express from 'express'
import { userServices } from '../services/userServices.js'
import { middleware } from '../middleware/auth.js'
export const router = express.Router()

router.post('/users', async (req, res) => {
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

router.post('/login', async (req, res) => {
  const data = req.body
  try {
    const token = await userServices.loginUser(data.email, data.password)
    res.status(200).json(token)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/me', middleware.authenticate, async (req, res) => {
  try {
    const userId = req.user.userId
    const user = await userServices.findUser(userId)
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export { router as userRoutes }
