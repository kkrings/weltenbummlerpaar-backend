import * as request from 'supertest';
import {
  getDiaryEntries,
  TeardownDB,
} from '@kkrings/weltenbummlerpaar-e2e-data';
import { INestApplication } from '@nestjs/common';
import { setupApp, setupDB } from './setup';

describe('DiaryEntriesController.findMany (e2e)', () => {
  let app: INestApplication;
  let teardownDB: TeardownDB;

  beforeEach(async () => {
    app = await setupApp();
  });

  beforeEach(async () => {
    teardownDB = await setupDB(app);
  });

  it('/', async () => {
    const response = await request(app.getHttpServer()).get('/diary-entries');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(getDiaryEntries().reverse());
  });

  it('/?searchTags=some search tag', async () => {
    const response = await request(app.getHttpServer()).get(
      '/diary-entries?searchTags=some search tag&',
    );
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(getDiaryEntries().slice(0, 2).reverse());
  });

  it('/?searchTags=some search tag&searchTags=some other search tag', async () => {
    const response = await request(app.getHttpServer()).get(
      '/diary-entries?searchTags=some search tag&searchTags=some other search tag',
    );
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(getDiaryEntries().slice(1, 2));
  });

  it('/?searchTags=some search tag&searchTags=some search tag', async () => {
    const response = await request(app.getHttpServer()).get(
      '/diary-entries?searchTags=some search tag&searchTags=some search tag',
    );
    expect(response.statusCode).toEqual(400);
  });

  it('/?skipDiaryEntries=1', async () => {
    const response = await request(app.getHttpServer()).get(
      '/diary-entries?skipDiaryEntries=1',
    );
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(getDiaryEntries().reverse().slice(1));
  });

  it('/?skipDiaryEntries=0', async () => {
    const response = await request(app.getHttpServer()).get(
      '/diary-entries?skipDiaryEntries=0',
    );
    expect(response.statusCode).toEqual(400);
  });

  it('/?skipDiaryEntries=1.5', async () => {
    const response = await request(app.getHttpServer()).get(
      '/diary-entries?skipDiaryEntries=1.5',
    );
    expect(response.statusCode).toEqual(400);
  });

  it('/?numDiaryEntries=1', async () => {
    const response = await request(app.getHttpServer()).get(
      '/diary-entries?numDiaryEntries=1',
    );
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(getDiaryEntries().reverse().slice(0, 1));
  });

  it('/?numDiaryEntries=0', async () => {
    const response = await request(app.getHttpServer()).get(
      '/diary-entries?numDiaryEntries=0',
    );
    expect(response.statusCode).toEqual(400);
  });

  it('/?numDiaryEntries=1.5', async () => {
    const response = await request(app.getHttpServer()).get(
      '/diary-entries?numDiaryEntries=1.5',
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
