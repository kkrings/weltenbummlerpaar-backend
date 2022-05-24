import * as request from 'supertest';
import * as data from '@kkrings/weltenbummlerpaar-e2e-data';
import { INestApplication } from '@nestjs/common';
import { UpdateDiaryEntryDto } from './../src/diary-entries/dto/update-diary-entry.dto';
import { login, setupApp, setupData, TeardownData } from './setup';

describe('DiaryEntriesController.updateOne', () => {
  let app: INestApplication;
  let accessToken: string;
  let teardownData: TeardownData;
  let diaryEntry: data.DiaryEntryDto;
  let updateDiaryEntryDto: UpdateDiaryEntryDto;

  beforeEach(async () => {
    app = await setupApp();
  });

  beforeEach(async () => {
    accessToken = await login(app);
  });

  beforeEach(async () => {
    teardownData = await setupData(app);
  });

  beforeEach(() => {
    diaryEntry = data.getDiaryEntries()[0];
  });

  beforeEach(() => {
    updateDiaryEntryDto = {
      title: 'some updated title',
      location: 'some updated location',
      body: 'some updated body',
      searchTags: ['some updated search tag'],
    };
  });

  describe('/{id} (PATCH)', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDiaryEntryDto)
        .expect(200);
    });

    it('updated diary entry should have been sent', () => {
      expect({
        id: response.body.id,
        title: response.body.title,
        location: response.body.location,
        body: response.body.body,
        searchTags: response.body.searchTags,
        images: response.body.images,
        createdAt: response.body.createdAt,
      }).toEqual({
        id: diaryEntry.id,
        ...updateDiaryEntryDto,
        images: diaryEntry.images,
        createdAt: diaryEntry.createdAt,
      });

      expect(response.body.updated).not.toEqual(diaryEntry.updatedAt);
    });
  });

  describe('/{id} (PATCH); invalid diary entry ID', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch('/diary-entries/invalidmongoid')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDiaryEntryDto);
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/{id} (PATCH); non-existing diary entry', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch('/diary-entries/62890e001db53966f0c44142')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDiaryEntryDto);
    });

    it('status code should be equal to 404', () => {
      expect(response.statusCode).toEqual(404);
    });
  });

  describe('/{id} (PATCH); invalid preview image ID', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          ...updateDiaryEntryDto,
          previewImage: 'invalidmongoid',
        });
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/{id} (PATCH); non-existing image', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          ...updateDiaryEntryDto,
          previewImage: data.getDiaryEntries()[2].previewImage?.id,
        });
    });

    it('status code should be equal to 404', () => {
      expect(response.statusCode).toEqual(404);
    });
  });

  afterEach(async () => {
    await app.close();
  });

  afterEach(async () => {
    await teardownData();
  });
});
