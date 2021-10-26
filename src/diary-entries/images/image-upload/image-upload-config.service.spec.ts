import { UnsupportedMediaTypeException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { FileFilterCallback } from 'multer';
import { env } from 'process';
import { Readable } from 'stream';
import { ImageUploadConfigService } from './image-upload-config.service';
import imageUploadConfig, { ImageUploadConfig } from './image-upload.config';

describe('ImageUploadConfigService', () => {
  let oldDestination: string;
  let service: ImageUploadConfigService;

  const mockConfig: ImageUploadConfig = {
    destination: 'some destination',
    manipulation: { imageWidth: 2500, imageQuality: 75 },
  };

  beforeAll(() => {
    oldDestination = env.WELTENBUMMLERPAAR_BACKEND_IMAGE_UPLOAD_DESTINATION;

    env.WELTENBUMMLERPAAR_BACKEND_IMAGE_UPLOAD_DESTINATION =
      mockConfig.destination;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [imageUploadConfig],
          ignoreEnvFile: true,
        }),
      ],
      providers: [ImageUploadConfigService],
    }).compile();

    service = module.get<ImageUploadConfigService>(ImageUploadConfigService);
  });

  describe('createMulterOptions', () => {
    let multerOptions: MulterModuleOptions;

    beforeEach(() => {
      multerOptions = service.createMulterOptions();
    });

    it('should return destination', () => {
      expect(multerOptions.dest).toEqual(mockConfig.destination);
    });

    describe('file filter', () => {
      let jpegFilterSpy: jest.SpyInstance;

      const imageUpload: Express.Multer.File = {
        fieldname: '',
        originalname: '',
        encoding: '',
        mimetype: 'image/jpeg',
        size: 0,
        stream: new Readable(),
        destination: '',
        filename: '',
        path: '',
        buffer: Buffer.from([]),
      };

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const fileFilterCallback: FileFilterCallback = () => {};

      beforeEach(() => {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        /* eslint-disable @typescript-eslint/no-empty-function */
        jpegFilterSpy = jest
          .spyOn(service, 'jpegFilter')
          .mockImplementation((fileType, cb) => {});
        /* eslint-enable @typescript-eslint/no-unused-vars */
        /* eslint-enable @typescript-eslint/no-empty-function */
      });

      beforeEach(() => {
        multerOptions.fileFilter?.(undefined, imageUpload, fileFilterCallback);
      });

      it('jpeg filter should have been called', () => {
        expect(jpegFilterSpy).toHaveBeenCalledWith(
          imageUpload.mimetype,
          fileFilterCallback,
        );
      });
    });
  });

  describe('jpegFilter', () => {
    it('should accept file of type image/jpeg', (done) => {
      const runTest = (error: Error | null, acceptFile?: boolean): void => {
        try {
          expect(error).toBeNull();
          expect(acceptFile).toBeTruthy();
          done();
        } catch (failure) {
          done(failure);
        }
      };

      service.jpegFilter('image/jpeg', runTest);
    });

    it('should return error', (done) => {
      const runTest = (error: Error | null, accceptFile?: boolean): void => {
        try {
          expect(error instanceof UnsupportedMediaTypeException).toBeTruthy();
          expect(accceptFile).toBeUndefined();
          done();
        } catch (failure) {
          done(failure);
        }
      };

      service.jpegFilter('image/png', runTest);
    });
  });

  afterAll(() => {
    env.WELTENBUMMLERPAAR_BACKEND_IMAGE_UPLOAD_DESTINATION = oldDestination;
  });
});
