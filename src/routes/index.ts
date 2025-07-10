import { Express } from 'express'
import userRouter from './users.routes'
const route = (app: Express) => {
  app.use('/v1/users/', userRouter)
}

export default route
