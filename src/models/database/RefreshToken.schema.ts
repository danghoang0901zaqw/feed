import { ObjectId } from 'mongodb'

interface RefreshTokenI {
  _id?: ObjectId
  token: string
  user_id: ObjectId
  created_at?: Date
  iat: number
  exp: number
}

export default class RefreshToken {
  _id?: ObjectId
  token: string
  user_id: ObjectId
  iat: Date
  exp: Date
  created_at?: Date

  constructor({ _id, token, user_id, iat, exp, created_at }: RefreshTokenI) {
    this._id = _id
    this.token = token
    this.user_id = user_id
    this.iat = new Date(iat * 1000)
    this.exp = new Date(exp * 1000)

    this.created_at = created_at || new Date()
  }
}
