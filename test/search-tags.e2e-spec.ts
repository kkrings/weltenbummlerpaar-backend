import * as request from 'supertest';
import * as data from '@kkrings/weltenbummlerpaar-e2e-data';
import { INestApplication } from '@nestjs/common';
import { login, setupApp, setupData, TeardownData } from './setup';

describe('SearchTagsController', () => {
  let app: INestApplication;
  let teardownDB: TeardownData;

  beforeEach(async () => {
    app = await setupApp();
  });

  beforeEach(async () => {
    teardownDB = await setupData(app);
  });

  describe('/ (GET)', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .get('/search-tags')
        .expect(200);
    });

    it('all search tags should have been sent', () => {
      expect(response.body).toEqual([
        'some other search tag',
        'some search tag',
        'yet another search tag',
      ]);
    });
  });

  describe('/?searchTag=some (GET)', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .get('/search-tags?searchTag=some')
        .expect(200);
    });

    it('only two search tags should have been sent', () => {
      expect(response.body).toEqual([
        'some other search tag',
        'some search tag',
      ]);
    });
  });

  describe('/?searchTag=yet (GET)', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .get('/search-tags?searchTag=yet')
        .expect(200);
    });

    it('only one search tag should have been sent', () => {
      expect(response.body).toEqual(['yet another search tag']);
    });
  });

  describe('after #diaryEntries[0] deleted', () => {
    let accessToken: string;
    let response: request.Response;

    beforeEach(async () => {
      accessToken = await login(app);
    });

    beforeEach(async () => {
      return await request(app.getHttpServer())
        .delete(`/diary-entries/${data.getDiaryEntries()[0].id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .get('/search-tags')
        .expect(200);
    });

    it('all search tags should have been sent', () => {
      expect(response.body).toEqual([
        'some other search tag',
        'some search tag',
        'yet another search tag',
      ]);
    });
  });

  describe('after #diaryEntries[2] deleted', () => {
    let accessToken: string;
    let response: request.Response;

    beforeEach(async () => {
      accessToken = await login(app);
    });

    beforeEach(async () => {
      return await request(app.getHttpServer())
        .delete(`/diary-entries/${data.getDiaryEntries()[2].id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .get('/search-tags')
        .expect(200);
    });

    it('only two search tags should have been sent', () => {
      expect(response.body).toEqual([
        'some other search tag',
        'some search tag',
      ]);
    });
  });

  afterEach(async () => {
    await app.close();
  });

  afterEach(async () => {
    await teardownDB();
  });
});
