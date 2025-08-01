import { Express } from 'express'
import userRouter from './users.routes'
import tweetRouter from './tweets.routes'
import bookmarkRouter from './bookmark.routes'
import likeRouter from './like.routes'

import AppError from '~/controllers/error.controler'
import HTTP_STATUS from '~/constants/httpStatus'
const route = (app: Express) => {
  app.use('/v1/users/', userRouter)
  app.use('/v1/tweets/', tweetRouter)
  app.use('/v1/bookmarks/', bookmarkRouter)
  app.use('/v1/likes/', likeRouter)

  app.all(/(.*)/, (req, res, next) => {
    const original = req.originalUrl
    const path = req.path
    next(new AppError(`Cannot find ${original} ${path} on this server`, HTTP_STATUS.NOT_FOUND))
  })
}

export default route
