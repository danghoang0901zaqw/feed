import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { LIKE_MESSAGES } from '~/constants/message'
import { UserI } from '~/models/database/User.schema'
import likesServices from '~/services/likes.services'

class LikeControllers {
  async like(req: Request, res: Response, next: NextFunction) {
    const { _id } = req.user as UserI
    const { tweet_id } = req.body
    const result = await likesServices.like(_id!.toString(), tweet_id)
    return res.status(HTTP_STATUS.CREATED).json({
      message: LIKE_MESSAGES.CREATE_SUCCESS,
      data: result
    })
  }
  async unLike(req: Request, res: Response, next: NextFunction) {
    const { like_id } = req.params
    const {_id}=req.user as UserI
    const result = await likesServices.unLike(like_id,_id!.toString())
    return res.status(HTTP_STATUS.OK).json({
      message: LIKE_MESSAGES.DELETE_SUCCESS,
      data: result
    })
  }
}
export default new LikeControllers()
