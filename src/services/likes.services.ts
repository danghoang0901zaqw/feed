import { ObjectId } from 'mongodb'
import Bookmark from '~/models/database/Bookmark.schema'
import databaseServices from './database.services'
import AppError from '~/controllers/error.controler'
import { LIKE_MESSAGES } from '~/constants/message'
import HTTP_STATUS from '~/constants/httpStatus'

class LikeServices {
  async like(user_id: string, tweet_id: string) {
    const result = await databaseServices.likes.findOneAndUpdate(
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
  async unLike(tweet_id: string, user_id: string) {
    const result = await databaseServices.likes.deleteOne({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
    if (result.deletedCount === 0) {
      throw new AppError(LIKE_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN)
    }
    return result
  }
}
export default new LikeServices()
