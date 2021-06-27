import { ObjectId } from 'mongodb'

export abstract class BaseSchema {
  _id: ObjectId
  createdAt: Date
  updatedAt: Date
}
