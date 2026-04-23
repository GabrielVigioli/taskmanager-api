import jwt from 'jsonwebtoken'

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1] // 1. pega o token do header
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // 2. verifica com jwt.verify
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'invalid token' })
  }
  // 4. se inválido, responde com 401
}

export const middleware = {
  authenticate
}
