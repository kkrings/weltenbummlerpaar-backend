import { Db, Document } from 'mongodb';
import { DiaryEntryJson } from './types/diary-entry.json';
import { asMongoId } from './utils';

const asDocument = (diaryEntry: DiaryEntryJson): Document => {
  const document: Document = {
    _id: asMongoId(diaryEntry.id),
    title: diaryEntry.title,
    location: diaryEntry.location,
    body: diaryEntry.body,
    searchTags: diaryEntry.searchTags,
    images: diaryEntry.images.map((image) => asMongoId(image.id)),
    createdAt: new Date(diaryEntry.createdAt),
    updatedAt: new Date(diaryEntry.updatedAt),
  };

  if (diaryEntry.dateRange) {
    document.dateRange = {
      dateMin: new Date(diaryEntry.dateRange.dateMin),
      dateMax: new Date(diaryEntry.dateRange.dateMax),
    };
  }

  if (diaryEntry.previewImage) {
    document.previewImage = asMongoId(diaryEntry.previewImage.id);
  }

  return document;
};

const asResponse = (diaryEntry: DiaryEntryJson): DiaryEntryJson => {
  const response: DiaryEntryJson = { ...diaryEntry };

  if (!diaryEntry.previewImage && diaryEntry.images) {
    response.previewImage = diaryEntry.images[0];
  }

  return response;
};

export const diaryEntriesInput: DiaryEntryJson[] = [
  {
    id: '627ed7fa044da63955745b4b',
    title: 'some title',
    location: 'some location',
    body: 'some body',
    searchTags: ['some search tag'],
    images: [],
    createdAt: new Date(2020, 2, 14).toISOString(),
    updatedAt: new Date(2020, 2, 14).toISOString(),
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
        createdAt: new Date(2020, 2, 15, 1).toISOString(),
        updatedAt: new Date(2020, 2, 15, 1).toISOString(),
      },
    ],
    createdAt: new Date(2020, 2, 15).toISOString(),
    updatedAt: new Date(2020, 2, 15, 1).toISOString(),
  },
  {
    id: '627fc51675cebfd2115a2d14',
    title: 'yet another title',
    location: 'yet another location',
    dateRange: {
      dateMin: new Date(2020, 2, 15).toISOString(),
      dateMax: new Date(2020, 2, 16).toISOString(),
    },
    body: 'yet another body',
    searchTags: ['yet another search tag'],
    previewImage: {
      id: '627fc55da0e3f3716f2f30d4',
      description: 'some other description',
      diaryEntryId: '627fc51675cebfd2115a2d14',
      createdAt: new Date(2020, 2, 16, 1).toISOString(),
      updatedAt: new Date(2020, 2, 16, 1).toISOString(),
    },
    images: [
      {
        id: '627fc55da0e3f3716f2f30d4',
        description: 'some other description',
        diaryEntryId: '627fc51675cebfd2115a2d14',
        createdAt: new Date(2020, 2, 16, 1).toISOString(),
        updatedAt: new Date(2020, 2, 16, 1).toISOString(),
      },
    ],
    createdAt: new Date(2020, 2, 16).toISOString(),
    updatedAt: new Date(2020, 2, 16, 1).toISOString(),
  },
];

export const diaryEntriesOutput = diaryEntriesInput.map((diaryEntry) =>
  asResponse(diaryEntry),
);

export async function insertDiaryEntries(database: Db): Promise<void> {
  const collection = database.collection('diaryentries');

  const documents = diaryEntriesInput.map((diaryEntry) =>
    asDocument(diaryEntry),
  );

  await collection.insertMany(documents);
}
