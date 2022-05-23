import * as request from 'supertest';
import { getDiaryEntries } from '@kkrings/weltenbummlerpaar-e2e-data';
import { INestApplication } from '@nestjs/common';
import { setupApp, setupData, TeardownData } from './setup';

describe('DiaryEntriesController.count (e2e)', () => {
  let app: INestApplication;
  let teardownData: TeardownData;

  beforeEach(async () => {
    app = await setupApp();
  });

  beforeEach(async () => {
    teardownData = await setupData(app);
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
    await teardownData();
  });
});
