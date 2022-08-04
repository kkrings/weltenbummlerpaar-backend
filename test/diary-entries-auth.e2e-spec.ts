import * as request from 'supertest';
import * as data from '@kkrings/weltenbummlerpaar-e2e-data';
import { INestApplication } from '@nestjs/common';
import { setupApp } from './setup';

describe('DiaryEntriesController (e2e), authorization', () => {
  let app: INestApplication;
  let diaryEntryId: string;
  let imageId: string;

  beforeEach(async () => {
    app = await setupApp();
  });

  beforeEach(() => {
    diaryEntryId = '62853e15140c5b51dfc498d0';
  });

  beforeEach(() => {
    imageId = '62dee8d6813ad4e7bccf6786';
  });

  it('/ (POST)', async () => {
    return await request(app.getHttpServer())
      .post('/diary-entries')
      .send({})
      .expect(401);
  });

  it('/{id} (PATCH)', async () => {
    return await request(app.getHttpServer())
      .patch(`/diary-entries/${diaryEntryId}`)
      .send({})
      .expect(401);
  });

  it('/{id} (DELETE)', async () => {
    return await request(app.getHttpServer())
      .delete(`/diary-entries/${diaryEntryId}`)
      .expect(401);
  });

  it('/{id}/images (POST)', async () => {
    return await request(app.getHttpServer())
      .post(`/diary-entries/${diaryEntryId}/images`)
      .attach('imageUpload', data.getImageFile())
      .field('description', 'some description')
      .expect(401);
  });

  it('/{diaryEntryId}/images/{imageId} (DELETE)', async () => {
    return await request(app.getHttpServer())
      .delete(`/diary-entries/${diaryEntryId}/images/${imageId}`)
      .expect(401);
  });

  afterEach(async () => {
    await app.close();
  });
});
