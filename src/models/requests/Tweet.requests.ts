import { TweetAudience, TweetType } from '~/constants/enum'
import { Media } from '../database/Tweet.schema'

export interface TweetBody {
  user_id: string
  type: TweetType
  audience: TweetAudience
  content: string
  parentId: string | null
  hashtags: string[]
  mentions: string[]
  media: Media[]
}
