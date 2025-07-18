import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { TWEET_MESSAGES } from '~/constants/message'
import { UserI } from '~/models/database/User.schema'
import { TweetBody } from '~/models/requests/Tweet.requests'
import tweetsServices from '~/services/tweets.services'

class TweetController {
  async get(req: Request<ParamsDictionary, any, TweetBody>, res: Response, next: NextFunction) {}
  async createTweet(req: Request<ParamsDictionary, any, TweetBody>, res: Response, next: NextFunction) {
    const { _id } = req.user as UserI
    const result = await tweetsServices.createTweet(_id!.toString(), req.body)
    return res.status(HTTP_STATUS.OK).json({
      message: TWEET_MESSAGES.CREATE_TWEET_SUCCESS,
      data: {
        ...result
      }
    })
  }
}
export default new TweetController()
