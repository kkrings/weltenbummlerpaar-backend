import * as request from 'supertest';
import * as data from '@kkrings/weltenbummlerpaar-e2e-data';
import { INestApplication } from '@nestjs/common';
import { CreateImageDto } from './../src/diary-entries/images/dto/create-image.dto';
import { login, setupApp, setupData, TeardownData } from './setup';
import { dateIsGreaterThan } from './utils';

describe('DiaryEntriesController.addImage', () => {
  let app: INestApplication;
  let accessToken: string;
  let teardownData: TeardownData;
  let diaryEntry: data.DiaryEntryDto;
  let createImageDto: CreateImageDto;

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
    createImageDto = {
      imageUpload: data.getImageFile(),
      description: 'some description',
    };
  });

  describe('/{id}/images (POST)', () => {
    let response: request.Response;

    beforeEach(() => {
      expect(diaryEntry.images).toEqual([]);
    });

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .post(`/diary-entries/${diaryEntry.id}/images`)
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('imageUpload', createImageDto.imageUpload)
        .field('description', createImageDto.description)
        .expect(201);
    }, 20000);

    it('image should have been uploaded', () => {
      const createdImage: data.ImageDto = response.body.images[0];

      expect({
        id: response.body.id,
        title: response.body.title,
        location: response.body.location,
        dateRange: response.body.dateRange,
        body: response.body.body,
        searchTags: response.body.searchTags,
        previewImage: response.body.previewImage,
        images: response.body.images,
        createdAt: response.body.createdAt,
      }).toEqual({
        id: diaryEntry.id,
        title: diaryEntry.title,
        location: diaryEntry.location,
        dateRange: diaryEntry.dateRange,
        body: diaryEntry.body,
        searchTags: diaryEntry.searchTags,
        previewImage: createdImage,
        images: [createdImage],
        createdAt: diaryEntry.createdAt,
      });

      expect(createdImage.description).toEqual(createImageDto.description);
      dateIsGreaterThan(response.body.updatedAt, diaryEntry.updatedAt);
    });
  });

  describe('/{id}/images (POST); non-JPEG file', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .post(`/diary-entries/${diaryEntry.id}/images`)
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('imageUpload', data.getImageFile('png'))
        .field('description', createImageDto.description);
    });

    it('status code should be equal to 415', () => {
      expect(response.statusCode).toEqual(415);
    });
  });

  describe('/{id}/images (POST); invalid diary entry ID', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .post('/diary-entries/invalidmongoid/images')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('imageUpload', createImageDto.imageUpload)
        .field('description', createImageDto.description);
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/{id}/images (POST); non-existing diary entry', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .post('/diary-entries/62890e001db53966f0c44142/images')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('imageUpload', createImageDto.imageUpload)
        .field('description', createImageDto.description);
    });

    it('status code should be equal to 404', () => {
      expect(response.statusCode).toEqual(404);
    });
  });

  describe('/{id}/images (POST); image upload missing', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .post(`/diary-entries/${diaryEntry.id}/images`)
        .set('Authorization', `Bearer ${accessToken}`)
        .field('description', createImageDto.description);
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/{id}/images (POST); description missing', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .post(`/diary-entries/${diaryEntry.id}/images`)
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('imageUpload', createImageDto.imageUpload);
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  afterEach(async () => {
    await app.close();
  });

  afterEach(async () => {
    await teardownData();
  });
});
