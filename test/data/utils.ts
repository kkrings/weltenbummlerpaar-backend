import { ObjectId } from 'mongodb';

export const asMongoId = (id: string): ObjectId =>
  ObjectId.createFromHexString(id);
