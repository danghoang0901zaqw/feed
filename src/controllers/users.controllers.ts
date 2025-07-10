import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import usersServices from '~/services/users.services'
import { UserSignUpRequest } from '~/models/requests/User.requests'

class UserControllers {
  signIn(req: Request, res: Response, next: NextFunction) {}
  async signUp(req: Request<ParamsDictionary, any, UserSignUpRequest>, res: Response, next: NextFunction) {
    const { email, password, date_of_birth, name } = req.body
    const result = await usersServices.create({
      email,
      password,
      date_of_birth,
      name
    })
    res.status(201).json({
      message: 'Sign up success',
      data: result
    })
  }
}
export default new UserControllers()