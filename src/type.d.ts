import { Request } from 'express'
import { TokenPayload } from 'jsonwebtoken'
import { UserI } from './models/database/User.schema'
declare module 'express' {
  interface Request {
    user?: UserI
    decodeAccessToken?: TokenPayload
    decodeEmailVerifyToken?: TokenPayload
    decodeRefreshToken?: TokenPayload
  }
}
