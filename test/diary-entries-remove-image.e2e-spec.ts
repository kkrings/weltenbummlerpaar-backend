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
  let imageId: string;

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

  beforeEach(() => {
    imageId = diaryEntry.previewImage?.id ?? '';
    expect(imageId).not.toEqual('');
  });

  describe('/{diaryEntryId}/images/{imageId} (DELETE)', () => {
    let response: request.Response;

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

  describe('/{diaryEntryId}/images/{imageId} (DELETE); invalid diary entry ID', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .delete(`/diary-entries/invalidmongoid/images/${imageId}`)
        .set('Authorization', `Bearer ${accessToken}`);
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/{diaryEntryId}/images/{imageId} (DELETE); non-existing diary entry', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .delete(`/diary-entries/62890e001db53966f0c44142/images/${imageId}`)
        .set('Authorization', `Bearer ${accessToken}`);
    });

    it('status code should be equal to 404', () => {
      expect(response.statusCode).toEqual(404);
    });
  });

  describe('/{diaryEntryId}/images/{imageId} (DELETE); invalid image ID', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .delete(`/diary-entries/${diaryEntry.id}/images/invalidmongoid`)
        .set('Authorization', `Bearer ${accessToken}`);
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/{diaryEntryId}/images/{imageId} (DELETE); non-existing image', () => {
    let response: request.Response;

    beforeEach(() => {
      diaryEntry = data.getDiaryEntries()[1];
    });

    beforeEach(() => {
      imageId = data.getDiaryEntries().at(2)?.previewImage?.id ?? '';
      expect(imageId).not.toEqual('');
    });

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .delete(`/diary-entries/${diaryEntry.id}/images/${imageId}`)
        .set('Authorization', `Bearer ${accessToken}`);
    });

    it('status code should be equal to 404', () => {
      expect(response.statusCode).toEqual(404);
    });
  });

  afterEach(async () => {
    await app.close();
  });

  afterEach(async () => {
    await teardownData();
  });
});
