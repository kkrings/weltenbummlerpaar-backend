import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { DatabaseConfigService } from './../src/database/database-config.service';
import { setupDB, TeardownDB } from './data/database';

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
    return await request(app.getHttpServer()).get('/diary-entries').expect(200);
  });

  afterEach(async () => {
    await app.close();
  });

  afterEach(async () => {
    await teardownDB();
  });
});
