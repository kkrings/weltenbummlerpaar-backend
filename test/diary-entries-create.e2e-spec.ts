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

  describe('/ (POST), with valid date range', () => {
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

  afterEach(async () => {
    await teardownDB(app);
  });

  afterEach(async () => {
    await app.close();
  });
});
