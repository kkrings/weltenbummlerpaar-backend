import { Db, Document } from 'mongodb';
import { asMongoId } from './utils';

const searchTags: Document[] = [
  {
    _id: asMongoId('627fcf2af04e16898554fbe9'),
    searchTag: 'some search tag',
    diaryEntries: [
      asMongoId('627ed7fa044da63955745b4b'),
      asMongoId('627fc4ae68118ac4af8486f4'),
    ],
    createdAt: new Date(2020, 2, 14),
    updatedAt: new Date(2020, 2, 15),
  },
  {
    _id: asMongoId('627fd0505b47cfd3bf1b05e6'),
    searchTag: 'some other search tag',
    diaryEntries: [asMongoId('627fc4ae68118ac4af8486f4')],
    createdAt: new Date(2020, 2, 15),
    updatedAt: new Date(2020, 2, 15),
  },
  {
    _id: asMongoId('627fd081fb7f6f1f296d947e'),
    searchTag: 'yet another search tag',
    diaryEntries: [asMongoId('627fc51675cebfd2115a2d14')],
    createdAt: new Date(2020, 2, 16),
    updatedAt: new Date(2020, 2, 16),
  },
];

export async function insertSearchTags(database: Db): Promise<void> {
  const collection = database.collection('searchtags');
  await collection.insertMany(searchTags);
}
