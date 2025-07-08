import { NextFunction, Request, Response } from 'express'

class UserControllers {
  get(req: Request, res: Response, next: NextFunction): void {
    res.send('Hello word')
  }
}
export default new UserControllers()