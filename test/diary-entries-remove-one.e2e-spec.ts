import * as request from 'supertest';
import * as data from '@kkrings/weltenbummlerpaar-e2e-data';
import { INestApplication } from '@nestjs/common';
import { login, setupApp, setupData, TeardownData } from './setup';

describe('DiaryEntriesController.removeOne', () => {
  let app: INestApplication;
  let accessToken: string;
  let teardownDB: TeardownData;

  beforeEach(async () => {
    app = await setupApp();
  });

  beforeEach(async () => {
    accessToken = await login(app);
  });

  beforeEach(async () => {
    teardownDB = await setupData(app);
  });

  describe('/{id} (DELETE)', () => {
    let diaryEntry: data.DiaryEntryDto;
    let response: request.Response;

    beforeEach(() => {
      diaryEntry = data.getDiaryEntries()[0];
    });

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .delete(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('deleted diary entry should have been sent', () => {
      expect(response.body).toEqual(diaryEntry);
    });
  });

  describe('/{id} (DELETE); invalid diary entry ID', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .delete('/diary-entries/invalidmongoid')
        .set('Authorization', `Bearer ${accessToken}`);
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/{id} (DELETE); non-existing diary entry', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .delete('/diary-entries/62890e001db53966f0c44142')
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
    await teardownDB();
  });
});
