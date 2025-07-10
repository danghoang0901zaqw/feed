import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enum'

interface UserI {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: Date
  password: string
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string | null
  forgot_password_token?: string | null
  verify?: UserVerifyStatus
  bio?: string | null
  location?: string | null
  website?: string | null
  username?: string
  avatar?: string | null
  cover?: string | null
}
export default class User {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: Date
  password: string
  created_at: Date
  updated_at: Date
  email_verify_token: string | null
  forgot_password_token: string | null
  verify: UserVerifyStatus
  bio: string | null
  location: string | null
  website: string | null
  username: string
  avatar: string | null
  cover: string | null
  constructor(user: UserI) {
    const date = new Date()
    this._id = user._id
    this.name = user.name || ''
    this.email = user.email || ''
    this.date_of_birth = user.date_of_birth || date
    this.password = user.password
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverified
    this.bio = user.bio || ''
    this.location = user.location || ''
    this.website = user.website || ''
    this.username = user.username || ''
    this.avatar = user.avatar || ''
    this.cover = user.cover || ''
  }
}
