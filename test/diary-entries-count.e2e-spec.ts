import * as request from 'supertest';
import {
  getDiaryEntries,
  TeardownDB,
} from '@kkrings/weltenbummlerpaar-e2e-data';
import { INestApplication } from '@nestjs/common';
import { setupApp, setupDB } from './setup';

describe('DiaryEntriesController.count (e2e)', () => {
  let app: INestApplication;
  let teardownDB: TeardownDB;

  beforeEach(async () => {
    app = await setupApp();
  });

  beforeEach(async () => {
    teardownDB = await setupDB(app);
  });

  it('/count', async () => {
    const response = await request(app.getHttpServer()).get(
      '/diary-entries/count',
    );
    expect(response.statusCode).toEqual(200);
    expect(parseInt(response.text)).toEqual(getDiaryEntries().length);
  });

  it('/count?searchTags=some search tag', async () => {
    const response = await request(app.getHttpServer()).get(
      '/diary-entries/count?searchTags=some search tag&',
    );
    expect(response.statusCode).toEqual(200);
    expect(parseInt(response.text)).toEqual(
      getDiaryEntries().slice(0, 2).length,
    );
  });

  it('/count?searchTags=some search tag&searchTags=some other search tag', async () => {
    const response = await request(app.getHttpServer()).get(
      '/diary-entries/count?searchTags=some search tag&searchTags=some other search tag',
    );
    expect(response.statusCode).toEqual(200);
    expect(parseInt(response.text)).toEqual(
      getDiaryEntries().slice(1, 2).length,
    );
  });

  it('/count?searchTags=some search tag&searchTags=some search tag', async () => {
    const response = await request(app.getHttpServer()).get(
      '/diary-entries/count?searchTags=some search tag&searchTags=some search tag',
    );
    expect(response.statusCode).toEqual(400);
  });

  afterEach(async () => {
    await app.close();
  });

  afterEach(async () => {
    await teardownDB();
  });
});
