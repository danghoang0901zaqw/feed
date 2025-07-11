import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import usersServices from '~/services/users.services'
import { EmailVerifyBody, SignInRequest, SignUpRequest, SingOutRequest } from '~/models/requests/User.requests'
import { USER_MESSAGES } from '~/constants/message'
import HTTP_STATUS from '~/constants/httpStatus'
import { JwtPayload } from '~/utils/jwt'

class UserControllers {
  async signIn(req: Request<ParamsDictionary, any, SignInRequest>, res: Response, next: NextFunction) {
    const { email, password } = req.body
    const result = await usersServices.signIn(email, password)
    return res.status(HTTP_STATUS.OK).json({
      message: USER_MESSAGES.LOGIN_SUCCESS,
      data: result
    })
  }
  async signUp(req: Request<ParamsDictionary, any, SignUpRequest>, res: Response, next: NextFunction) {
    const { email, password, date_of_birth, name } = req.body
    const result = await usersServices.signUp({
      email,
      password,
      date_of_birth,
      name
    })
    return res.status(HTTP_STATUS.CREATED).json({
      message: USER_MESSAGES.REGISTER_SUCCESS,
      data: result
    })
  }
  async signOut(req: Request<ParamsDictionary, any, SingOutRequest>, res: Response, next: NextFunction) {
    const result = await usersServices.signOut(req.body.refresh_token)
    return res.status(HTTP_STATUS.OK).json({
      ...result
    })
  }
  async verifyEmail(
    req: Request<ParamsDictionary, any, EmailVerifyBody> & { decodeEmailVerifyToken: JwtPayload },
    res: Response,
    next: NextFunction
  ) {
    const result = await usersServices.verifyEmail(req.decodeEmailVerifyToken.userId)
    return res.status(HTTP_STATUS.OK).json({
      message: USER_MESSAGES.EMAIL_VERIFY_SUCCESS,
      data: result
    })
  }

  async resendVerifyEmail(req: Request & { decodeAccessToken: JwtPayload }, res: Response, next: NextFunction) {
    const { userId } = req.decodeAccessToken
    const result = await usersServices.resendVerifyEmail(userId)
    return res.status(HTTP_STATUS.OK).json({
      message: USER_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS,
      data: result
    })
  }
}
export default new UserControllers()
