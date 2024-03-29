import * as request from 'supertest';
import * as data from '@kkrings/weltenbummlerpaar-e2e-data';
import { INestApplication } from '@nestjs/common';
import { setupApp, setupData, TeardownData } from './setup';

describe('DiaryEntriesController.fineOne', () => {
  let app: INestApplication;
  let teardownData: TeardownData;

  beforeEach(async () => {
    app = await setupApp();
  });

  beforeEach(async () => {
    teardownData = await setupData(app);
  });

  describe('/{id} (GET)', () => {
    let diaryEntry: data.DiaryEntryDto;
    let response: request.Response;

    beforeEach(() => {
      diaryEntry = data.getDiaryEntries()[0];
    });

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .get(`/diary-entries/${diaryEntry.id}`)
        .expect(200);
    });

    it('diary entry should have been sent', () => {
      expect(response.body).toEqual(diaryEntry);
    });
  });

  describe('/{id} (GET); invalid diary entry ID', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer()).get(
        '/diary-entries/invalidmongoid',
      );
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/{id} (GET); non-existing diary entry', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer()).get(
        '/diary-entries/62890e001db53966f0c44142',
      );
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
