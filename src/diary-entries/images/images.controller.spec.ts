import { Test, TestingModule } from '@nestjs/testing';
import { nextTick } from 'process';
import { Express } from 'express';
import { ObjectId } from 'mongodb';
import { Readable } from 'stream';
import { MongoIdParams } from '../../dto/mongo-id-params.dto';
import { ImageDto } from './dto/image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Image } from './schemas/image.schema';

class ImagesServiceMock {
  private readonly otherFields = {
    diaryEntryId: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  async updateOne(
    imageId: string,
    updateImageDto: UpdateImageDto,
  ): Promise<Image> {
    return {
      _id: ObjectId.createFromHexString(imageId),
      description: updateImageDto.description ?? 'some description',
      ...this.otherFields,
    };
  }
}

describe('ImagesController', () => {
  const mockService = new ImagesServiceMock();

  let controller: ImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [
        {
          provide: ImagesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ImagesController>(ImagesController);
  });

  describe('updateOne', () => {
    const updateOneSpy = jest.spyOn(mockService, 'updateOne');

    const params: MongoIdParams = {
      id: new ObjectId().toHexString(),
    };

    let updateImageDto: UpdateImageDto;

    beforeEach(() => {
      updateImageDto = {
        description: 'some other description',
      };
    });

    describe('with image upload', () => {
      const imageUpload: Express.Multer.File = {
        fieldname: '',
        originalname: '',
        encoding: '',
        mimetype: '',
        size: 0,
        stream: new Readable(),
        destination: '',
        filename: '',
        path: 'some path',
        buffer: Buffer.from([]),
      };

      let expectedImageDto: ImageDto;
      let imageDto: ImageDto;

      beforeEach(async () => {
        const image = await mockService.updateOne(params.id, updateImageDto);

        expectedImageDto = {
          id: image._id.toHexString(),
          description: image.description,
          diaryEntryId: image.diaryEntryId.toHexString(),
          createdAt: image.createdAt,
          updatedAt: image.updatedAt,
        };
      });

      beforeEach(async () => {
        imageDto = await controller.updateOne(
          params,
          updateImageDto,
          imageUpload,
        );
      });

      it('updated image should have been returned', () => {
        expect(imageDto).toEqual(expectedImageDto);
      });

      it('updateOne should have been called', () => {
        expect(updateOneSpy).toHaveBeenCalledWith(params.id, updateImageDto);
      });

      it('updateImageDto should hold path to image upload', () => {
        expect(updateImageDto.imageUpload).toEqual(imageUpload.path);
      });
    });

    describe('without image upload', () => {
      beforeEach(async () => {
        await controller.updateOne(params, updateImageDto);
      });

      it('updateImageDto should not hold path to image upload', () => {
        expect(updateImageDto.imageUpload).toBeUndefined();
      });
    });
  });

  afterAll(async () => {
    // jimp dependency: wait for import in node_modules/gifwrap/src/gifcodec.js
    const waitForNextTick = async (): Promise<unknown> =>
      await new Promise((resolve) => nextTick(resolve));

    await waitForNextTick();
  });
});
