import jwt, { SignOptions } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { TokenType } from '~/constants/enum'
dotenv.config()

export interface JwtPayload {
  userId: string
  tokenType: TokenType
}

export const generateToken = (payload: JwtPayload, expiresIn: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY as string,
      { expiresIn, algorithm: 'HS256' } as SignOptions,
      (err, token) => {
        if (err) {
          throw reject(err)
        } else {
          resolve(token as string)
        }
      }
    )
  })
}

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string)
  return decoded
}
