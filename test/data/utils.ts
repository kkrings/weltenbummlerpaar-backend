import { ObjectId } from 'mongodb';

export const asMongoId = (id?: string): ObjectId | null =>
  id ? ObjectId.createFromHexString(id) : null;
