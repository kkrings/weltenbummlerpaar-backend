import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
  getDiaryEntries,
  setupDB,
  TeardownDB,
} from '@kkrings/weltenbummlerpaar-e2e-data';
import { AppModule } from './../src/app.module';
import { DatabaseConfigService } from './../src/database/database-config.service';

describe('DiaryEntriesController (e2e)', () => {
  let app: INestApplication;
  let teardownDB: TeardownDB;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    const config = app.get(DatabaseConfigService).createMongooseOptions();
    expect(config.uri).toBeDefined();
    teardownDB = await setupDB(config.uri as string);
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/diary-entries');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(getDiaryEntries().reverse());
  });

  afterEach(async () => {
    await app.close();
  });

  afterEach(async () => {
    await teardownDB();
  });
});
