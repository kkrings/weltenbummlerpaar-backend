import * as request from 'supertest';
import * as data from '@kkrings/weltenbummlerpaar-e2e-data';
import { INestApplication } from '@nestjs/common';
import { login, setupApp, setupData, TeardownData } from './setup';
import { dateIsGreaterThan } from './utils';

describe('ImagesController.updateOne', () => {
  let app: INestApplication;
  let accessToken: string;
  let teardownData: TeardownData;
  let image: data.ImageDto;
  let patchedDescription: string;

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
    const previewImage = data.getDiaryEntries().at(1)?.previewImage;
    expect(previewImage).toBeDefined();
    image = previewImage as data.ImageDto;
  });

  beforeEach(() => {
    patchedDescription = 'some patched description';
    expect(image.description).not.toEqual(patchedDescription);
  });

  describe('/{id} (PATCh); upload new image', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/images/${image.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('imageUpload', data.getImageFile())
        .expect(200);
    }, 20000);

    it('image should have been updated', () => {
      expect({
        id: response.body.id,
        description: response.body.description,
        createdAt: response.body.createdAt,
      }).toEqual({
        id: image.id,
        description: image.description,
        createdAt: image.createdAt,
      });

      dateIsGreaterThan(response.body.updatedAt, image.updatedAt);
    });
  });

  describe('/{id} (PATCh); patch description', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/images/${image.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .field('description', patchedDescription)
        .expect(200);
    });

    it('image should have been updated', () => {
      expect({
        id: response.body.id,
        description: response.body.description,
        createdAt: response.body.createdAt,
      }).toEqual({
        id: image.id,
        description: patchedDescription,
        createdAt: image.createdAt,
      });

      dateIsGreaterThan(response.body.updatedAt, image.updatedAt);
    });
  });

  describe('/{id} (PATCh); non-JPEG file', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/images/${image.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('imageUpload', data.getImageFile('png'));
    });

    it('status code should be equal to 415', () => {
      expect(response.statusCode).toEqual(415);
    });
  });

  describe('/{id} (PATCh); invalid image ID', () => {
    let response: request.Response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch('/images/invalidmongoid')
        .set('Authorization', `Bearer ${accessToken}`)
        .field('description', patchedDescription);
    });

    it('status code should be equal to 400', () => {
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/{id} (PATCh); non-existing image', () => {
    let response: request.Response;
    let imageId: string;

    beforeEach(() => {
      imageId = '62dee8d6813ad4e7bccf6786';
    });

    beforeEach(() => {
      expect(data.getImages().map((image) => image.id)).not.toContain(imageId);
    });

    beforeEach(async () => {
      response = await request(app.getHttpServer())
        .patch(`/images/${imageId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .field('description', patchedDescription);
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
