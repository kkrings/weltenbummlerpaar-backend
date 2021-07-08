import { NotFoundException } from '@nestjs/common'
import { ObjectId } from 'mongodb'

export abstract class BaseSchema {
  _id: ObjectId
  createdAt: Date
  updatedAt: Date
}

export async function throwOnNull<T> (
  documentId: string,
  queryDocument: () => Promise<T | null>
): Promise<T> {
  const document = await queryDocument()

  if (document === null) {
    throw new NotFoundException(`Document with ID ${documentId} could not be found.`)
  }

  return document
}
