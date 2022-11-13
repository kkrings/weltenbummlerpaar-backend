import { ConfigModule } from '@nestjs/config';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { env } from 'process';
import { ImageUploadConfigService } from './image-upload-config.service';
import imageUploadConfig, { ImageUploadConfig } from './image-upload.config';

describe('ImageUploadConfigService', () => {
  let oldDestination: string | undefined;
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
  });

  afterAll(() => {
    env.WELTENBUMMLERPAAR_BACKEND_IMAGE_UPLOAD_DESTINATION = oldDestination;
  });
});
