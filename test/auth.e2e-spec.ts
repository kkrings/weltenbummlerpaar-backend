import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { setupDB, TeardownDB } from '@kkrings/weltenbummlerpaar-e2e-data';
import { AppModule } from './../src/app.module';
import { AdminLoginDto } from './../src/auth/admins/dto/admin-login.dto';
import { AdminsService } from './../src/auth/admins/admins.service';
import { DatabaseConfigService } from './../src/database/database-config.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let admin: AdminLoginDto;
  let teardownDB: TeardownDB;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
  });

  beforeEach(async () => {
    await app.init();
  });

  beforeEach(async () => {
    const config = app.get(DatabaseConfigService).createMongooseOptions();
    expect(config.uri).toBeDefined();
    teardownDB = await setupDB(config.uri as string);
  });

  beforeEach(() => {
    admin = { username: 'admin', password: 'admin' };
  });

  beforeEach(async () => {
    const adminsService = app.get(AdminsService);
    await adminsService.register(admin);
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

  afterEach(async () => {
    await teardownDB();
  });
});
