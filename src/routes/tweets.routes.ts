import catchAsync from '~/middlewares/catchAsync.middlewares'
import express from 'express'
import tweetsController from '~/controllers/tweets.controller'
import { isAuthorized } from '~/middlewares/auth.middlewares'
import { validatorCreateTweet } from '~/middlewares/tweets.middlewares'
const router = express.Router()
router
  .route('/')
  .post(isAuthorized, validatorCreateTweet, catchAsync(tweetsController.createTweet))
export default router
