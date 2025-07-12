import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import usersServices from '~/services/users.services'
import { EmailVerifyBody, SignInRequest, SignUpRequest, SingOutRequest } from '~/models/requests/User.requests'
import { USER_MESSAGES } from '~/constants/message'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserI } from '~/models/database/User.schema'

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
  async verifyEmail(req: Request<ParamsDictionary, any, EmailVerifyBody>, res: Response, next: NextFunction) {
    const result = await usersServices.verifyEmail(req.decodeEmailVerifyToken.userId)
    return res.status(HTTP_STATUS.OK).json({
      message: USER_MESSAGES.EMAIL_VERIFY_SUCCESS,
      data: result
    })
  }

  async resendVerifyEmail(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.decodeAccessToken
    const result = await usersServices.resendVerifyEmail(userId)
    return res.status(HTTP_STATUS.OK).json({
      message: USER_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS,
      data: result
    })
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { _id } = req.user as UserI
    const result = await usersServices.forgotPassword(_id!.toString())
    return res.status(HTTP_STATUS.OK).json({
      message: USER_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD,
      data: result
    })
  }
  async verifyForgotPasswordToken(req: Request, res: Response, next: NextFunction) {
    return res.status(HTTP_STATUS.OK).json({
      message: USER_MESSAGES.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS,
      data: true
    })
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { _id } = req.user as UserI
    const { password } = req.body
    await usersServices.resetPassword(_id!.toString(), password)
    return res.status(HTTP_STATUS.OK).json({
      message: USER_MESSAGES.RESET_PASSWORD_SUCCESS,
      data: true
    })
  }

  async myProfile(req: Request, res: Response, next: NextFunction) {
    const { _id } = req.user as UserI
    const result = await usersServices.myProfile(_id!.toString())
    return res.status(HTTP_STATUS.OK).json({
      data: {
        ...result
      }
    })
  }
}
export default new UserControllers()
