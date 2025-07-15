import dotenv from 'dotenv'
dotenv.config()
import User from '~/models/database/User.schema'
import databaseServices from './database.services'
import { comparePassword, hashPassword } from '~/utils/bcrypt'
import { generateToken, verifyToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import AppError from '~/controllers/error.controler'
import { USER_MESSAGES } from '~/constants/message'
import HTTP_STATUS from '~/constants/httpStatus'
import { ObjectId } from 'mongodb'
import { SignUpRequest, UpdateProfileBody } from '~/models/requests/User.requests'
import Follower from '~/models/database/Follower.schema'
import RefreshToken from '~/models/database/RefreshToken.schema'

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
  private signRefreshToken(userId: string, exp?: number): Promise<string> {
    if (exp) {
      return generateToken(
        {
          userId,
          tokenType: TokenType.RefreshToken,
          exp
        },
        process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d'
      )
    }
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

  private async getOAuthGoogleToken(code: string) {
    const body = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      redirect_uri: process.env.GOOGLE_REDIRECT_URI ?? '',
      grant_type: 'authorization_code'
    })
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    })
    const data = await response.json()
    return data
  }
  private async getUserInfoOAuth(access_token: string, id_token: string) {
    const url = `https://openidconnect.googleapis.com/v1/userinfo?access_token=${access_token}&alt=json`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })
    const data = await response.json()
    return data
  }

  private async decodeRefreshToken(refresh_token: string) {
    const decode = await verifyToken(refresh_token)
    return decode
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
    const { iat, exp } = await this.decodeRefreshToken(refreshToken)
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        user_id,
        token: refreshToken,
        iat,
        exp
      })
    )
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
    const { iat, exp } = await this.decodeRefreshToken(refreshToken)
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user._id),
        token: refreshToken,
        iat,
        exp
      })
    )
    return { ...user, accessToken, refreshToken }
  }

  async oAuth(code: string) {
    const { access_token, id_token } = await this.getOAuthGoogleToken(code)
    const userInfo = await this.getUserInfoOAuth(access_token, id_token)
    const user = await databaseServices.users.findOne({ email: userInfo.email })
    if (!user) {
      const data = await this.signUp({
        email: userInfo.email,
        password: Math.random().toString(36).substring(2, 7),
        date_of_birth: new Date().toISOString(),
        name: userInfo.name
      })
      return {
        ...data,
        newUser: true
      }
    } else {
      const [accessToken, refreshToken] = await Promise.all([
        this.signAccessToken(user._id.toString()),
        this.signRefreshToken(user._id.toString())
      ])
      const { iat, exp } = await this.decodeRefreshToken(refreshToken)
      await databaseServices.refreshTokens.insertOne(
        new RefreshToken({
          user_id: new ObjectId(user._id),
          token: refreshToken,
          iat,
          exp
        })
      )
      return {
        accessToken,
        refreshToken,
        newUser: false
      }
    }
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

  async updateMyProfile(user_id: string, payload: UpdateProfileBody) {
    const allowedFields: (keyof UpdateProfileBody)[] = [
      'name',
      'date_of_birth',
      'bio',
      'location',
      'website',
      'username',
      'avatar',
      'cover'
    ]
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([key]) => allowedFields.includes(key as keyof UpdateProfileBody))
    ) as UpdateProfileBody
    const updateUser = await databaseServices.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...filteredPayload,
          ...(filteredPayload.date_of_birth && { date_of_birth: new Date(filteredPayload.date_of_birth) })
        },
        $currentDate: { updated_at: true }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          forgot_password_token: 0,
          email_verify_token: 0
        }
      }
    )
    return updateUser
  }

  async following(user_id: string, follower_user_id: string) {
    await databaseServices.followers.insertOne(
      new Follower({
        user_id: new ObjectId(user_id),
        follower_user_id: new ObjectId(follower_user_id)
      })
    )
    return true
  }
  async unFollowing(user_id: string, follower_user_id: string) {
    await databaseServices.followers.deleteOne({
      user_id: new ObjectId(user_id),
      follower_user_id: new ObjectId(follower_user_id)
    })
    return true
  }
  async changePassword(user_id: string, password: string) {
    await databaseServices.users.updateOne(
      { _id: new ObjectId(user_id) },
      { $set: { password: hashPassword(password) }, $currentDate: { updated_at: true } }
    )
    return true
  }
  async refreshToken(user_id: string, refresh_token: string, exp?: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id, exp),
      databaseServices.refreshTokens.deleteOne({ token: refresh_token })
    ])
    const { iat, exp: expires } = await this.decodeRefreshToken(refreshToken)
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refreshToken,
        iat,
        exp: expires
      })
    )
    return {
      accessToken,
      refreshToken
    }
  }
}
export default new UsersService()
