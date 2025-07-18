import express from 'express'
import likesControllers from '~/controllers/likes.controllers'
import { isAuthorized } from '~/middlewares/auth.middlewares'
import catchAsync from '~/middlewares/catchAsync.middlewares'
const router = express.Router()
router.route('/').post(isAuthorized, catchAsync(likesControllers.like))
router.route('/:tweet_id').delete(isAuthorized, catchAsync(likesControllers.unLike))
export default router
