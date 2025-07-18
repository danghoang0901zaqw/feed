import { ObjectId } from 'mongodb'
import Bookmark from '~/models/database/Bookmark.schema'
import databaseServices from './database.services'
import AppError from '~/controllers/error.controler'
import { BOOKMARK_MESSAGES } from '~/constants/message'
import HTTP_STATUS from '~/constants/httpStatus'

class BookmarkServices {
  async addBookmark(user_id: string, tweet_id: string) {
    const result = await databaseServices.bookmarks.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Bookmark({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      },
      {
        returnDocument: 'after',
        upsert: true
      }
    )
    return result
  }
  async deleteBookmark(bookmark_id: string, user_id: string) {
    const result = await databaseServices.bookmarks.deleteOne({
      user_id: new ObjectId(user_id),
      _id: new ObjectId(bookmark_id)
    })
    if (result.deletedCount === 0) {
      throw new AppError(BOOKMARK_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN)
    }
    return result
  }
}
export default new BookmarkServices()
