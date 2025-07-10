import dotenv from 'dotenv'
dotenv.config()
import User from '~/models/database/User.schema'
import databaseServices from './database.services'
import { UserSignUpRequest } from '~/models/requests/User.requests'
import { comparePassword, hashPassword } from '~/utils/bcrypt'
import { generateToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enum'
import AppError from '~/controllers/error.controler'
import { USER_MESSAGES } from '~/constants/message'
import HTTP_STATUS from '~/constants/httpStatus'
import { ObjectId } from 'mongodb'

class UsersService {
  private signAccessToken(userId: string): Promise<string> {
    return generateToken(
      {
        userId,
        tokenType: TokenType.AccessToken
      },
      process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '1h'
    )
  }
  private signRefreshToken(userId: string): Promise<string> {
    return generateToken(
      {
        userId,
        tokenType: TokenType.RefreshToken
      },
      process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d'
    )
  }
  async signUp(payload: UserSignUpRequest) {
    const result = await databaseServices.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    const user_id = result.insertedId.toString()
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    await databaseServices.refreshTokens.insertOne({
      user_id: new ObjectId(user_id),
      token: refreshToken
    })
    return { result, accessToken, refreshToken }
  }
  async signIn(email: string, plainTextPassword: string) {
    const user = await databaseServices.users.findOne({ email })
    if (!user) {
      throw new AppError(USER_MESSAGES.LOGIN_INCORRECT, HTTP_STATUS.BAD_REQUEST)
    }

    if (!comparePassword(plainTextPassword, user.password)) {
      throw new AppError(USER_MESSAGES.LOGIN_INCORRECT, HTTP_STATUS.BAD_REQUEST)
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(String(user._id)!),
      this.signRefreshToken(String(user._id)!)
    ])
    await databaseServices.refreshTokens.insertOne({
      user_id: new ObjectId(user._id),
      token: refreshToken
    })
    return { ...user, accessToken, refreshToken }
  }
  async signOut(refreshToken: string) {
    await databaseServices.refreshTokens.deleteOne({ token: refreshToken })
    return { message: USER_MESSAGES.LOGOUT_SUCCESS, data: true }
  }
  async checkEmailExists(email: string) {
    const user = await databaseServices.users.findOne({ email })
    return !!user
  }
}
export default new UsersService()
