import * as request from 'supertest';
import {
  TeardownDB,
  setupDB as _setupDB,
} from '@kkrings/weltenbummlerpaar-e2e-data';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { DatabaseConfigService } from '../src/database/database-config.service';
import { setupPipes } from './../src/setup';

export async function setupApp(): Promise<INestApplication> {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = module.createNestApplication();
  setupPipes(app);

  await app.init();

  return app;
}

export async function setupDB(app: INestApplication): Promise<TeardownDB> {
  const config = app.get(DatabaseConfigService).createMongooseOptions();
  expect(config.uri).toBeDefined();
  return await _setupDB(config.uri as string);
}

export async function login(app: INestApplication): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ username: 'admin', password: 'admin' });

  expect(response.statusCode).toEqual(201);
  expect(response.body).toHaveProperty('accessToken');

  return response.body.accessToken;
}
