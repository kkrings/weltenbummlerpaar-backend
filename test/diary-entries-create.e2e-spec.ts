import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { CreateDiaryEntryDto } from './../src/diary-entries/dto/create-diary-entry.dto';
import { login, setupApp } from './setup';
import { teardownDB } from './teardown';

describe('DiaryEntriesController.create (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    app = await setupApp();
  });

  beforeEach(async () => {
    accessToken = await login(app);
  });

  describe('/ (POST)', () => {
    let createDiaryEntryDto: CreateDiaryEntryDto;
    let response: request.Response;

    beforeEach(() => {
      createDiaryEntryDto = {
        title: 'some title',
        location: 'some location',
        body: 'some body',
        searchTags: ['some search tag'],
      };
    });

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .post('/diary-entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createDiaryEntryDto)
        .expect(201);
    });

    it('created diary entry should have been sent', () => {
      expect({
        title: response.body.title,
        location: response.body.location,
        body: response.body.body,
        searchTags: response.body.searchTags,
      }).toEqual(createDiaryEntryDto);
    });
  });

  describe('/ (POST); valid date range', () => {
    let createDiaryEntryDto: CreateDiaryEntryDto;
    let response: request.Response;

    beforeEach(() => {
      createDiaryEntryDto = {
        title: 'some title',
        location: 'some location',
        dateRange: {
          dateMin: new Date(2020, 2, 14),
          dateMax: new Date(2020, 2, 14),
        },
        body: 'some body',
        searchTags: ['some search tag'],
      };
    });

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .post('/diary-entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createDiaryEntryDto)
        .expect(201);
    });

    it('created diary entry should have been sent', () => {
      expect({
        title: response.body.title,
        location: response.body.location,
        dateRange: {
          dateMin: new Date(response.body.dateRange.dateMin),
          dateMax: new Date(response.body.dateRange.dateMax),
        },
        body: response.body.body,
        searchTags: response.body.searchTags,
      }).toEqual(createDiaryEntryDto);
    });
  });

  describe('/ (POST); invalid start date', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .post('/diary-entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'some title',
          location: 'some location',
          dateRange: {
            dateMin: 'invalid start date',
            dateMax: '2020-02-14',
          },
          body: 'some body',
          searchTags: ['some search tag'],
        });
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/ (POST); invalid end date', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .post('/diary-entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'some title',
          location: 'some location',
          dateRange: {
            dateMin: '2020-02-14',
            dateMax: 'invalid end date',
          },
          body: 'some body',
          searchTags: ['some search tag'],
        });
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/ (POST); invalid date range', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .post('/diary-entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'some title',
          location: 'some location',
          dateRange: {
            dateMin: '2020-02-14',
            dateMax: '2020-02-13',
          },
          body: 'some body',
          searchTags: ['some search tag'],
        });
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/ (POST); invalid search tags', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .post('/diary-entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'some title',
          location: 'some location',
          body: 'some body',
          searchTags: ['some search tag', 'some search tag'],
        });
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/ (POST); invalid diary entry', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .post('/diary-entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  afterEach(async () => {
    await teardownDB(app);
  });

  afterEach(async () => {
    await app.close();
  });
});
