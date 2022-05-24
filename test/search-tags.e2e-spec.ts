import * as request from 'supertest';
import * as data from '@kkrings/weltenbummlerpaar-e2e-data';
import { INestApplication } from '@nestjs/common';
import { CreateDiaryEntryDto } from './../src/diary-entries/dto/create-diary-entry.dto';
import { login, setupApp, setupData, TeardownData } from './setup';

describe('SearchTagsController', () => {
  let app: INestApplication;
  let teardownData: TeardownData;

  beforeEach(async () => {
    app = await setupApp();
  });

  beforeEach(async () => {
    teardownData = await setupData(app);
  });

  describe('/ (GET)', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .get('/search-tags')
        .expect(200);
    });

    it('three search tags should have been sent', () => {
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

    it('two search tags should have been sent', () => {
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

    it('one search tag should have been sent', () => {
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

    it('three search tags should have been sent', () => {
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

    it('two search tags should have been sent', () => {
      expect(response.body).toEqual([
        'some other search tag',
        'some search tag',
      ]);
    });
  });

  describe('after created new diary entry', () => {
    let accessToken: string;

    beforeEach(async () => {
      accessToken = await login(app);
    });

    beforeEach(async () => {
      const diaryEntry: CreateDiaryEntryDto = {
        title: 'new title',
        location: 'new location',
        body: 'new body',
        searchTags: ['some search tag', 'A New Search Tag'],
      };

      return await request(app.getHttpServer())
        .post('/diary-entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(diaryEntry)
        .expect(201);
    });

    it('four search tags should have been sent', async () => {
      const response = await request(app.getHttpServer()).get('/search-tags');

      expect(response.statusCode).toEqual(200);

      expect(response.body).toEqual([
        'A New Search Tag',
        'some other search tag',
        'some search tag',
        'yet another search tag',
      ]);
    });

    it("'A New Search Tag' should have been sent", async () => {
      const response = await request(app.getHttpServer()).get(
        '/search-tags?searchTag=NEW',
      );

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(['A New Search Tag']);
    });
  });

  describe('after #diaryEntries[2] updated', () => {
    let accessToken: string;
    let response: request.Response;

    beforeEach(async () => {
      accessToken = await login(app);
    });

    beforeEach(async () => {
      const diaryEntry = data.getDiaryEntries()[2];

      return await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          // title: diaryEntry.title,
          // location: diaryEntry.location,
          // body: diaryEntry.body,
          searchTags: ['some search tag', 'A New Search Tag'],
        })
        .expect(200);
    });

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .get('/search-tags')
        .expect(200);
    });

    it('three search tags should have been sent', () => {
      expect(response.body).toEqual([
        'A New Search Tag',
        'some other search tag',
        'some search tag',
      ]);
    });
  });

  afterEach(async () => {
    await app.close();
  });

  afterEach(async () => {
    await teardownData();
  });
});
