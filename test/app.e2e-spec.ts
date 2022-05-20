import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { appConstants } from './../src/app.constants';
import { setupApp } from './setup';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupApp();
  });

  it('/ (GET)', async () => {
    return await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(appConstants.apiDescription);
  });

  afterEach(async () => {
    await app.close();
  });
});
