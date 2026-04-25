import express from 'express'
import { userServices } from './services/userServices.js'
import { taskServices } from './services/taskServices.js'
import { userRoutes } from './routes/userRoutes.js'
import { taskRoutes } from './routes/taskRoutes.js'

import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
  res.status(200).send('Hello World')
})
app.use('/', userRoutes)
app.use('/', taskRoutes)

app.listen(3000, () => {
  console.log('server is listening on port 3000...')
})
