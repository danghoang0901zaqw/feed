import { ObjectId } from 'mongodb'

export interface HashTagI {
  _id?: ObjectId
  name: string
  created_at?: Date
}

class HashTag {
  _id?: ObjectId
  name: string
  created_at?: Date
  constructor({ _id, name, created_at }: HashTagI) {
    this._id = _id || new ObjectId()
    this.name = name
    this.created_at = created_at || new Date()
  }
}

export default HashTag
