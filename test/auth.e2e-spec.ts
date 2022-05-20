import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AdminLoginDto } from './../src/auth/admins/dto/admin-login.dto';
import { setupApp } from './setup';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let admin: AdminLoginDto;

  beforeEach(async () => {
    app = await setupApp();
  });

  beforeEach(() => {
    admin = { username: 'admin', password: 'admin' };
  });

  it('/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(admin);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty('accessToken');
  });

  it('/login (POST), wrong password', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: admin.username, password: 'wrong password' })
      .expect(401);
  });

  afterEach(async () => {
    await app.close();
  });
});
