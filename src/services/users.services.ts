import dotenv from 'dotenv'
dotenv.config()
import User from '~/models/database/User.schema'
import databaseServices from './database.services'
import { comparePassword, hashPassword } from '~/utils/bcrypt'
import { generateToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import AppError from '~/controllers/error.controler'
import { USER_MESSAGES } from '~/constants/message'
import HTTP_STATUS from '~/constants/httpStatus'
import { ObjectId } from 'mongodb'
import { SignUpRequest } from '~/models/requests/User.requests'

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
  private signEmailVerifyToken(userId: string): Promise<string> {
    return generateToken(
      {
        userId,
        tokenType: TokenType.RefreshToken
      },
      process.env.JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN || '5m'
    )
  }
  private signForgotPasswordToken(userId: string): Promise<string> {
    return generateToken(
      {
        userId,
        tokenType: TokenType.RefreshToken
      },
      process.env.JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN || '5m'
    )
  }
  async signUp(payload: SignUpRequest) {
    const user_id = new ObjectId()
    const emailVerifyToken = await this.signEmailVerifyToken(user_id.toString())

    const result = await databaseServices.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password),
        email_verify_token: emailVerifyToken
      })
    )
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user_id.toString()),
      this.signRefreshToken(user_id.toString())
    ])
    await databaseServices.refreshTokens.insertOne({
      user_id,
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
  async verifyEmail(user_id: string) {
    const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      throw new AppError(USER_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    if (!user.email_verify_token) {
      return true
    }
    const [_, accessToken, refreshToken] = await Promise.all([
      databaseServices.users.updateOne(
        { _id: new ObjectId(user_id) },
        { $set: { email_verify_token: null, verify: UserVerifyStatus.Verified }, $currentDate: { updated_at: true } }
      ),
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    return {
      accessToken,
      refreshToken
    }
  }
  async resendVerifyEmail(user_id: string) {
    const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
    console.log(user)
    if (!user) {
      throw new AppError(USER_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    if (user.verify === UserVerifyStatus.Verified) {
      throw new AppError(USER_MESSAGES.EMAIL_WAS_VERIFIED, HTTP_STATUS.BAD_REQUEST)
    }
    const emailVerifyToken = await this.signEmailVerifyToken(user_id)
    await databaseServices.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { email_verify_token: emailVerifyToken },
        $currentDate: { updated_at: true }
      }
    )
    return true
  }

  async forgotPassword(user_id: string) {
    await databaseServices.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { forgot_password_token: await this.signForgotPasswordToken(user_id) },
        $currentDate: { updated_at: true }
      }
    )
    return true
  }
  async resetPassword(user_id: string, plainTextPassword: string) {
    await databaseServices.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: { forgot_password_token: null, password: hashPassword(plainTextPassword) },
        $currentDate: { updated_at: true }
      }
    )
  }

  async myProfile(userId: string) {
    const user = await databaseServices.users.findOne(
      { _id: new ObjectId(userId) },
      {
        projection: {
          password: 0,
          forgot_password_token: 0,
          email_verify_token: 0
        }
      }
    )
    return user
  }
}
export default new UsersService()
