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
    diaryEntry = data.getDiaryEntries()[2];
  });

  beforeEach(() => {
    updateDiaryEntryDto = { title: 'some updated title' };
  });

  describe('/{id} (PATCH); patch title', () => {
    let response: request.Response;

    beforeEach(async () => {
      expect(diaryEntry.title).not.toEqual(updateDiaryEntryDto.title);

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
        dateRange: response.body.dateRange,
        body: response.body.body,
        searchTags: response.body.searchTags,
        previewImage: response.body.previewImage,
        images: response.body.images,
        createdAt: response.body.createdAt,
      }).toEqual({
        id: diaryEntry.id,
        title: updateDiaryEntryDto.title,
        location: diaryEntry.location,
        dateRange: diaryEntry.dateRange,
        body: diaryEntry.body,
        searchTags: diaryEntry.searchTags,
        previewImage: diaryEntry.previewImage,
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

  describe('/{id} (PATCH); patch preview image', () => {
    let response: request.Response;

    beforeEach(async () => {
      expect(diaryEntry.previewImage).not.toEqual(diaryEntry.images[1]);

      response = await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ previewImage: diaryEntry.images[1].id })
        .expect(200);
    });

    it('updated diary entry should have been sent', () => {
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
        previewImage: diaryEntry.images[1],
        images: diaryEntry.images,
        createdAt: diaryEntry.createdAt,
      });

      expect(response.body.updated).not.toEqual(diaryEntry.updatedAt);
    });
  });

  describe('/{id} (PATCH); invalid preview image ID', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ previewImage: 'invalidmongoid' });
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/{id} (PATCH); non-existing preview image', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ previewImage: data.getDiaryEntries()[1].previewImage?.id });
    });

    it('status code should be equal to 404', () => {
      expect(response.statusCode).toEqual(404);
    });
  });

  describe('/{id} (PATCH); patch images', () => {
    let updateImagesDto: data.ImageDto[];
    let response: request.Response;

    beforeEach(() => {
      updateImagesDto = [diaryEntry.images[1], diaryEntry.images[0]];
    });

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ images: updateImagesDto.map((image) => image.id) })
        .expect(200);
    });

    it('updated diary entry should have been sent', () => {
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
        previewImage: diaryEntry.previewImage,
        images: updateImagesDto,
        createdAt: diaryEntry.createdAt,
      });

      expect(response.body.updated).not.toEqual(diaryEntry.updatedAt);
    });
  });

  describe('/{id} (PATCH); invalid image ID', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ images: ['invalidmongoid'] });
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
        .send({ images: [data.getDiaryEntries()[1].previewImage?.id] });
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
