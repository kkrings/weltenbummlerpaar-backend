import * as request from 'supertest';
import * as data from '@kkrings/weltenbummlerpaar-e2e-data';
import { INestApplication } from '@nestjs/common';
import { login, setupApp, setupData, TeardownData } from './setup';
import { dateIsGreaterThan } from './utils';

describe('DiaryEntriesController.removeImage', () => {
  let app: INestApplication;
  let accessToken: string;
  let teardownData: TeardownData;
  let diaryEntry: data.DiaryEntryDto;

  beforeEach(async () => {
    app = await setupApp();
  });

  beforeEach(async () => {
    accessToken = await login(app);
  });

  beforeEach(async () => {
    teardownData = await setupData(app);
  });

  beforeEach(() => {
    diaryEntry = data.getDiaryEntries()[1];
  });

  describe('/{diaryEntryId}/images/{imageId} (DELETE)', () => {
    let imageId: string;
    let response: request.Response;

    beforeEach(() => {
      imageId = '627fc4e95c21bce26c1f78a5';
    });

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .delete(`/diary-entries/${diaryEntry.id}/images/${imageId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('image should have been uploaded', () => {
      expect({
        id: response.body.id,
        title: response.body.title,
        location: response.body.location,
        dateRange: response.body.dateRange,
        body: response.body.body,
        searchTags: response.body.searchTags,
        previewImage: response.body.previewImage,
        images: response.body.images,
        createdAt: response.body.createdAt,
      }).toEqual({
        id: diaryEntry.id,
        title: diaryEntry.title,
        location: diaryEntry.location,
        dateRange: diaryEntry.dateRange,
        body: diaryEntry.body,
        searchTags: diaryEntry.searchTags,
        previewImage: undefined,
        images: [],
        createdAt: diaryEntry.createdAt,
      });

      dateIsGreaterThan(response.body.updatedAt, diaryEntry.updatedAt);
    });
  });

  afterEach(async () => {
    await app.close();
  });

  afterEach(async () => {
    await teardownData();
  });
});
