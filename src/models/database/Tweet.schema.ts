import { MediaType } from 'express'
import { ObjectId } from 'mongodb'
import { TweetAudience, TweetType } from '~/constants/enum'
export interface Media {
  url: string
  mediaType: MediaType
}
interface TweetI {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parentId: string | null
  hashtags: ObjectId[]
  mentions: string[]
  media: Media[]
  guest_views?: number
  user_views?: number
  created_at?: Date
  updated_at?: Date
}

export default class Tweet {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parentId: ObjectId | null
  hashtags: ObjectId[]
  mentions: ObjectId[]
  media: Media[]
  guest_views: number
  user_views: number
  created_at: Date
  updated_at: Date
  constructor({
    _id,
    user_id,
    type,
    audience,
    content,
    parentId,
    hashtags,
    mentions,
    media,
    guest_views,
    user_views
  }: TweetI) {
    this._id = _id
    this.user_id = user_id
    this.type = type
    this.audience = audience
    this.content = content
    this.parentId = parentId ? new ObjectId(parentId) : null
    this.hashtags = hashtags
    this.mentions = mentions.map((mention) => new ObjectId(mention))
    this.media = media
    this.guest_views = guest_views || 0
    this.user_views = user_views || 0
    this.created_at = new Date()
    this.updated_at = new Date()
  }
}
