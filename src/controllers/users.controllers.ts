import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import usersServices from '~/services/users.services'
import {
  EmailVerifyBody,
  SignInRequest,
  SignUpRequest,
  SingOutRequest,
  UpdateProfileBody
} from '~/models/requests/User.requests'
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

  async signInOAuthGoogle(req: Request, res: Response, next: NextFunction) {
    const { code } = req.query
    const { accessToken, refreshToken, newUser } = await usersServices.oAuth(code as string)
    const url = `${process.env.DOMAIN_CLIENT}?access_token=${accessToken}&refresh_token=${refreshToken}&new_user=${newUser}`
    return res.redirect(url)
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
      message: USER_MESSAGES.LOGOUT_SUCCESS,
      data: result
    })
  }
  async refreshToken(req: Request<ParamsDictionary, any, SingOutRequest>, res: Response, next: NextFunction) {
    const { userId, exp } = req.decodeRefreshToken
    const { refresh_token } = req.body
    const result = await usersServices.refreshToken(userId, refresh_token, exp)
    return res.status(HTTP_STATUS.OK).json({
      message: USER_MESSAGES.REFRESH_TOKEN_SUCCESS,
      data: { ...result }
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

  async updateMyProfile(req: Request<ParamsDictionary, any, UpdateProfileBody>, res: Response, next: NextFunction) {
    const { _id } = req.user as UserI
    const result = await usersServices.updateMyProfile(_id!.toString(), req.body)
    return res.status(HTTP_STATUS.OK).json({
      message: USER_MESSAGES.UPDATE_PROFILE_SUCCESS,
      data: {
        ...result
      }
    })
  }
  async following(req: Request, res: Response, next: NextFunction) {
    const { follower_user_id } = req.body
    const { _id } = req.user as UserI
    const result = await usersServices.following(_id!.toString(), follower_user_id)
    return res.status(HTTP_STATUS.CREATED).json({
      message: USER_MESSAGES.FOLLOW_SUCCESS,
      data: result
    })
  }

  async unFollowing(req: Request, res: Response, next: NextFunction) {
    const { follower_user_id } = req.body
    const { _id } = req.user as UserI
    const result = await usersServices.unFollowing(_id!.toString(), follower_user_id)
    return res.status(HTTP_STATUS.OK).json({
      message: USER_MESSAGES.UN_FOLLOW_SUCCESS,
      data: result
    })
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    const { password } = req.body
    const { _id } = req.user as UserI
    const result = await usersServices.changePassword(_id!.toString(), password)
    return res.status(HTTP_STATUS.OK).json({
      message: USER_MESSAGES.CHANGE_PASSWORD_SUCCESS,
      data: result
    })
  }
}
export default new UserControllers()
