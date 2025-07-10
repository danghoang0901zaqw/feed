import dotenv from 'dotenv'
dotenv.config()
import User from '~/models/database/User.schema'
import databaseServices from './database.services'
import { UserSignUpRequest } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/bcrypt'
import { generateToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enum'

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
  async create(payload: UserSignUpRequest) {
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
    return { result, accessToken, refreshToken }
  }
  async checkEmailExists(email: string) {
    const user = await databaseServices.users.findOne({ email })
    return !!user
  }
}
export default new UsersService()
