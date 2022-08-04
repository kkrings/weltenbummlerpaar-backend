import * as request from 'supertest';
import * as data from '@kkrings/weltenbummlerpaar-e2e-data';
import { INestApplication } from '@nestjs/common';
import { UpdateDiaryEntryDto } from './../src/diary-entries/dto/update-diary-entry.dto';
import { login, setupApp, setupData, TeardownData } from './setup';
import { dateIsGreaterThan } from './utils';

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

      dateIsGreaterThan(response.body.updatedAt, diaryEntry.updatedAt);
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

  describe('/{id} (PATCH); patch date range', () => {
    let newDateRange: data.DateRangeDto;
    let patchDateRangeDto: UpdateDiaryEntryDto;
    let response: request.Response;

    beforeEach(() => {
      newDateRange = {
        dateMin: new Date(2020, 2, 14).toISOString(),
        dateMax: new Date(2020, 2, 14).toISOString(),
      };
    });

    beforeEach(() => {
      patchDateRangeDto = {
        dateRange: {
          dateMin: new Date(newDateRange.dateMin),
          dateMax: new Date(newDateRange.dateMax),
        },
      };
    });

    beforeEach(() => {
      expect(diaryEntry.dateRange).not.toEqual(newDateRange);
    });

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchDateRangeDto)
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
        dateRange: newDateRange,
        body: diaryEntry.body,
        searchTags: diaryEntry.searchTags,
        previewImage: diaryEntry.previewImage,
        images: diaryEntry.images,
        createdAt: diaryEntry.createdAt,
      });

      dateIsGreaterThan(response.body.updatedAt, diaryEntry.updatedAt);
    });
  });

  describe('/{id} (PATCH); unset date range', () => {
    let unsetDateRangeDto: UpdateDiaryEntryDto;
    let response: request.Response;

    beforeEach(() => {
      unsetDateRangeDto = { dateRange: null };
    });

    beforeEach(() => {
      expect(diaryEntry.dateRange).toBeDefined();
    });

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(unsetDateRangeDto)
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
        dateRange: undefined,
        body: diaryEntry.body,
        searchTags: diaryEntry.searchTags,
        previewImage: diaryEntry.previewImage,
        images: diaryEntry.images,
        createdAt: diaryEntry.createdAt,
      });

      dateIsGreaterThan(response.body.updatedAt, diaryEntry.updatedAt);
    });
  });

  describe('/{id} (PATCH); invalid start date', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          dateRange: {
            dateMin: 'invalid start date',
            dateMax: '2020-02-14',
          },
        });
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/{id} (PATCH); invalid end date', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          dateRange: {
            dateMin: '2020-02-14',
            dateMax: 'invalid end date',
          },
        });
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/{id} (PATCH); invalid date range', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          dateRange: {
            dateMin: '2020-02-14',
            dateMax: '2020-02-13',
          },
        });
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/{id} (PATCH); patch preview image', () => {
    let newPreviewImage: data.ImageDto;
    let patchPreviewImageDto: UpdateDiaryEntryDto;
    let response: request.Response;

    beforeEach(() => {
      newPreviewImage = diaryEntry.images[1];
    });

    beforeEach(() => {
      patchPreviewImageDto = {
        previewImage: newPreviewImage.id,
      };
    });

    beforeEach(() => {
      expect(diaryEntry.previewImage).not.toEqual(newPreviewImage);
    });

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchPreviewImageDto)
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
        previewImage: newPreviewImage,
        images: diaryEntry.images,
        createdAt: diaryEntry.createdAt,
      });

      dateIsGreaterThan(response.body.updatedAt, diaryEntry.updatedAt);
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
    let patchImagesDto: data.ImageDto[];
    let response: request.Response;

    beforeEach(() => {
      patchImagesDto = [diaryEntry.images[1], diaryEntry.images[0]];
    });

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ images: patchImagesDto.map((image) => image.id) })
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
        images: patchImagesDto,
        createdAt: diaryEntry.createdAt,
      });

      dateIsGreaterThan(response.body.updatedAt, diaryEntry.updatedAt);
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

  describe('/{id} (PATCH); patch search tags', () => {
    let newSearchTags: string[];
    let patchSearchTagsDto: UpdateDiaryEntryDto;
    let response: request.Response;

    beforeEach(() => {
      newSearchTags = ['some new search tag'];
    });

    beforeEach(() => {
      patchSearchTagsDto = { searchTags: newSearchTags };
    });

    beforeEach(() => {
      expect(diaryEntry.searchTags).not.toEqual(newSearchTags);
    });

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchSearchTagsDto)
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
        searchTags: newSearchTags,
        previewImage: diaryEntry.previewImage,
        images: diaryEntry.images,
        createdAt: diaryEntry.createdAt,
      });

      dateIsGreaterThan(response.body.updatedAt, diaryEntry.updatedAt);
    });
  });

  describe('/{id} (PATCH); invalid search tags', () => {
    let response: request.Response;

    beforeEach(async () => {
      const searchTag = 'some new search tag';

      response = await request(app.getHttpServer())
        .patch(`/diary-entries/${diaryEntry.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ searchTags: [searchTag, searchTag] });
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
