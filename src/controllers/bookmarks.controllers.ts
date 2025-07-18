import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { BOOKMARK_MESSAGES } from '~/constants/message'
import { UserI } from '~/models/database/User.schema'
import bookmarksServices from '~/services/bookmarks.services'

class BookmarkControllers {
  async addBookmark(req: Request, res: Response, next: NextFunction) {
    const { _id } = req.user as UserI
    const { tweet_id } = req.body
    const result = await bookmarksServices.addBookmark(_id!.toString(), tweet_id)
    return res.status(HTTP_STATUS.CREATED).json({
      message: BOOKMARK_MESSAGES.CREATE_SUCCESS,
      data: result
    })
  }
  async deleteBookmark(req: Request, res: Response, next: NextFunction) {
    const { bookmark_id } = req.params
    const {_id}=req.user as UserI
    const result = await bookmarksServices.deleteBookmark(bookmark_id,_id!.toString())
    return res.status(HTTP_STATUS.OK).json({
      message: BOOKMARK_MESSAGES.DELETE_SUCCESS,
      data: result
    })
  }
}
export default new BookmarkControllers()
