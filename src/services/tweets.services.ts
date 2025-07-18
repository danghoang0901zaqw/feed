import { TweetBody } from '~/models/requests/Tweet.requests'
import databaseServices from './database.services'
import Tweet from '~/models/database/Tweet.schema'
import { ObjectId } from 'mongodb'
import HashTag from '~/models/database/Hashtag.schema'

class TweetsServices {
  async createHashtag(hashtags: string[]) {
    return await Promise.all(
      hashtags.map((hashtag) => {
        return databaseServices.hashtags.findOneAndUpdate(
          { name: hashtag },
          {
            $setOnInsert: new HashTag({
              name: hashtag
            })
          },
          {
            returnDocument: 'after',
            upsert: true
          }
        )
      })
    )
  }
  async createTweet(user_id: string, payload: TweetBody) {
    const hashtags = await this.createHashtag(payload.hashtags)
    const result = await databaseServices.tweets.insertOne(
      new Tweet({
        user_id: new ObjectId(user_id),
        content: payload.content,
        hashtags: hashtags?.map((result) => result?._id).filter((id): id is ObjectId => id instanceof ObjectId),
        mentions: payload.mentions,
        type: payload.type,
        audience: payload.audience,
        parentId: payload.parentId,
        media: payload.media
      })
    )
    const tweet = await databaseServices.tweets.findOne({ _id: result.insertedId })
    return tweet
  }
}
export default new TweetsServices()
