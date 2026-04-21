import { error } from 'console'
import { prisma } from '../lib/prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const saltRounds = 10

const createUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })
  console.log(`Usuario criado com sucesso: ${JSON.stringify(user)}`)
  return user
}

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  })
  if (user) {
    const match = await bcrypt.compare(password, user.password)
    if (match) {
      const token = jwt.sign(
        {
          userId: user.id
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )
      return token
    } else {
      throw new Error('Credentials not valid')
    }
  } else {
    throw new Error('You have to signup first')
  }
}
export const userServices = {
  createUser,
  loginUser
}
