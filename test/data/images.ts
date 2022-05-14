import { Db, Document } from 'mongodb';
import { diaryEntriesInput } from './diary-entries';
import { ImageJson } from './types/image.json';
import { asMongoId } from './utils';

const images = diaryEntriesInput.map((diaryEntry) => diaryEntry.images).flat();

const asDocument = (image: ImageJson): Document => ({
  _id: asMongoId(image.id),
  description: image.description,
  diaryEntryId: asMongoId(image.diaryEntryId),
  createdAt: new Date(image.createdAt),
  updatedAt: new Date(image.updatedAt),
});

export async function insertImages(database: Db): Promise<void> {
  const collection = database.collection('images');
  const documents = images.map((image) => asDocument(image));
  await collection.insertMany(documents);
}
