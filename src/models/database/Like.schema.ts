import { ObjectId } from 'mongodb'

interface LikeI {
  _id?: ObjectId
  user_id: ObjectId
  tweet_id: ObjectId
  created_at?: Date
  updated_at?: Date
}
class Like {
  _id?: ObjectId
  user_id: ObjectId
  tweet_id: ObjectId
  created_at: Date
  updated_at: Date
  constructor({ _id, user_id, tweet_id, created_at, updated_at }: LikeI) {
    this._id = _id || new ObjectId()
    this.user_id = user_id
    this.tweet_id = tweet_id
    this.created_at = created_at || new Date()
    this.updated_at = updated_at || new Date()
  }
}

export default Like
