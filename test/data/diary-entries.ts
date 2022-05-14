import { Db, Document } from 'mongodb';
import { DiaryEntryDto } from '../../src/diary-entries/dto/diary-entry.dto';
import { asMongoId } from './utils';

export const diaryEntries: DiaryEntryDto[] = [
  {
    id: '627ed7fa044da63955745b4b',
    title: 'some title',
    location: 'some location',
    body: 'some body',
    searchTags: ['some search tag'],
    images: [],
    createdAt: new Date(2020, 2, 14),
    updatedAt: new Date(2020, 2, 14),
  },
  {
    id: '627fc4ae68118ac4af8486f4',
    title: 'some other title',
    location: 'some other location',
    body: 'some other body',
    searchTags: ['some search tag', 'some other search tag'],
    images: [
      {
        id: '627fc4e95c21bce26c1f78a5',
        description: 'some description',
        diaryEntryId: '627fc4ae68118ac4af8486f4',
        createdAt: new Date(2020, 2, 15, 1),
        updatedAt: new Date(2020, 2, 15, 1),
      },
    ],
    createdAt: new Date(2020, 2, 15),
    updatedAt: new Date(2020, 2, 15, 1),
  },
  {
    id: '627fc51675cebfd2115a2d14',
    title: 'yet another title',
    location: 'yet another location',
    dateRange: {
      dateMin: new Date(2020, 2, 15),
      dateMax: new Date(2020, 2, 16),
    },
    body: 'yet another body',
    searchTags: ['yet another search tag'],
    previewImage: {
      id: '627fc55da0e3f3716f2f30d4',
      description: 'some other description',
      diaryEntryId: '627fc51675cebfd2115a2d14',
      createdAt: new Date(2020, 2, 16, 1),
      updatedAt: new Date(2020, 2, 16, 1),
    },
    images: [
      {
        id: '627fc55da0e3f3716f2f30d4',
        description: 'some other description',
        diaryEntryId: '627fc51675cebfd2115a2d14',
        createdAt: new Date(2020, 2, 16, 1),
        updatedAt: new Date(2020, 2, 16, 1),
      },
    ],
    createdAt: new Date(2020, 2, 16),
    updatedAt: new Date(2020, 2, 16, 1),
  },
];

const asDocument = (diaryEntry: DiaryEntryDto): Document => ({
  _id: asMongoId(diaryEntry.id),
  title: diaryEntry.title,
  location: diaryEntry.location,
  dateRange: diaryEntry.dateRange,
  body: diaryEntry.body,
  searchTags: diaryEntry.searchTags,
  previewImage: asMongoId(diaryEntry.previewImage?.id),
  images: diaryEntry.images.map((image) => asMongoId(image.id)),
  createdAt: diaryEntry.createdAt,
  updatedAt: diaryEntry.updatedAt,
});

export async function insertDiaryEntries(database: Db): Promise<void> {
  const collection = database.collection('diaryentries');
  const documents = diaryEntries.map((diaryEntry) => asDocument(diaryEntry));
  await collection.insertMany(documents);
}
