import * as request from 'supertest';
import * as data from '@kkrings/weltenbummlerpaar-e2e-data';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { setupPipes } from './../src/setup';
import { getDatabaseUri, getImageUploadDir } from './utils';

export type TeardownData = data.Teardown;

export async function setupApp(): Promise<INestApplication> {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = module.createNestApplication();
  setupPipes(app);

  await app.init();

  return app;
}

export async function setupData(app: INestApplication): Promise<TeardownData> {
  return await data.setupData({
    url: getDatabaseUri(app),
    storage: getImageUploadDir(app),
  });
}

export async function login(app: INestApplication): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ username: 'admin', password: 'admin' });

  expect(response.statusCode).toEqual(201);
  expect(response.body).toHaveProperty('accessToken');

  return response.body.accessToken;
}
