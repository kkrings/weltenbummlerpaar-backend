import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupApp } from './setup';

describe('DiaryEntriesController (e2e), authorization', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupApp();
  });

  it('/ (POST)', async () => {
    return await request(app.getHttpServer())
      .post('/diary-entries')
      .send({})
      .expect(401);
  });

  it('/{id} (PATCH)', async () => {
    return await request(app.getHttpServer())
      .patch('/diary-entries/62853e15140c5b51dfc498d0')
      .send({})
      .expect(401);
  });

  it('/{id} (DELETE)', async () => {
    return await request(app.getHttpServer())
      .delete('/diary-entries/62853e15140c5b51dfc498d0')
      .expect(401);
  });

  afterEach(async () => {
    await app.close();
  });
});
