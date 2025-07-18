import express from 'express'
import bookmarksControllers from '~/controllers/bookmarks.controllers'
import { isAuthorized } from '~/middlewares/auth.middlewares'
import catchAsync from '~/middlewares/catchAsync.middlewares'
const router = express.Router()
router.route('/').post(isAuthorized, catchAsync(bookmarksControllers.addBookmark))
router.route('/:bookmark_id').delete(isAuthorized, catchAsync(bookmarksControllers.deleteBookmark))
export default router
