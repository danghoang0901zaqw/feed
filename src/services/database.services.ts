import dotenv from 'dotenv'
import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb'
import Bookmark from '~/models/database/Bookmark.schema'
import Follower from '~/models/database/Follower.schema'
import HashTag from '~/models/database/Hashtag.schema'
import RefreshToken from '~/models/database/RefreshToken.schema'
import Tweet from '~/models/database/Tweet.schema'
import User from '~/models/database/User.schema'
dotenv.config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.gq6vrxw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    })
    this.db = this.client.db(process.env.DB_NAME)
  }
  async connect() {
    try {
      await this.client.connect()
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
    } finally {
    }
  }
  get users(): Collection<User> {
    return this.db.collection('users')
  }
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection('refresh_tokens')
  }
  get followers(): Collection<Follower> {
    return this.db.collection('followers')
  }
  get tweets(): Collection<Tweet> {
    return this.db.collection('tweets')
  }
  get hashtags():Collection<HashTag>{
    return this.db.collection('hashtags')
  }
  get bookmarks():Collection<Bookmark>{
    return this.db.collection('bookmarks')
  }
}
export default new DatabaseService()
