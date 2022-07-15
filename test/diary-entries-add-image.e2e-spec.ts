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

  beforeEach(async () => {
    app = await setupApp();
  });

  beforeEach(async () => {
    accessToken = await login(app);
  });

  beforeEach(async () => {
    teardownData = await setupData(app);
  });

  describe('/{id}/images (POST)', () => {
    let diaryEntry: data.DiaryEntryDto;
    let createImageDto: CreateImageDto;
    let response: request.Response;

    beforeEach(() => {
      diaryEntry = data.getDiaryEntries()[0];
    });

    beforeEach(() => {
      createImageDto = {
        imageUpload: data.getImageFile(),
        description: 'some description',
      };
    });

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

  afterEach(async () => {
    await app.close();
  });

  afterEach(async () => {
    await teardownData();
  });
});
