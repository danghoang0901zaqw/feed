import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import usersServices from '~/services/users.services'
import { UserSignUpRequest } from '~/models/requests/User.requests'
import { USER_MESSAGES } from '~/constants/message'
import HTTP_STATUS from '~/constants/httpStatus'

class UserControllers {
  async signIn(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body
    const result = await usersServices.signIn(email, password)
    res.status(HTTP_STATUS.OK).json({
      message: USER_MESSAGES.LOGIN_SUCCESS,
      data: result
    })
  }
  async signUp(req: Request<ParamsDictionary, any, UserSignUpRequest>, res: Response, next: NextFunction) {
    const { email, password, date_of_birth, name } = req.body
    const result = await usersServices.signUp({
      email,
      password,
      date_of_birth,
      name
    })
    res.status(HTTP_STATUS.CREATED).json({
      message: USER_MESSAGES.REGISTER_SUCCESS,
      data: result
    })
  }
}
export default new UserControllers()
