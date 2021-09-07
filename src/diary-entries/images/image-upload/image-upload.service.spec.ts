import * as Jimp from 'jimp';
import * as os from 'os';
import * as path from 'path';
import { promises as fs } from 'fs';
import { nextTick } from 'process';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { name } from '../../../../package.json';
import { ImageUploadService } from './image-upload.service';
import { Image } from '../schemas/image.schema';
import imageUploadConfig, { ImageUploadConfig } from './image-upload.config';

describe('ImageUploadService', () => {
  let imageDir: string;
  let mockConfig: ImageUploadConfig;
  let service: ImageUploadService;

  const image: Image = {
    _id: new ObjectId(),
    description: 'some description',
    diaryEntryId: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const imageName = `${image._id.toHexString()}.jpg`;

  beforeEach(async () => {
    imageDir = await fs.mkdtemp(path.join(os.tmpdir(), `${name}-`));
  });

  beforeEach(() => {
    mockConfig = {
      destination: imageDir,
      manipulation: { imageWidth: 50, imageQuality: 75 },
    };
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: imageUploadConfig.KEY,
          useValue: mockConfig,
        },
        ImageUploadService,
      ],
    }).compile();

    service = module.get<ImageUploadService>(ImageUploadService);
  });

  describe('moveImage', () => {
    let uploadPath: string;

    const uploadName = `${new ObjectId().toHexString()}.jpg`;

    beforeEach(() => {
      uploadPath = path.join(imageDir, uploadName);
    });

    beforeEach(async () => {
      await new Jimp(100, 100).writeAsync(uploadPath);
    });

    beforeEach(async () => {
      const files = await fs.readdir(imageDir);
      expect(files).toContain(uploadName);
      expect(files).not.toContain(imageName);
    });

    beforeEach(async () => {
      await service.moveImage(uploadPath, image);
    });

    beforeEach(async () => {
      const files = await fs.readdir(imageDir);
      expect(files).not.toContain(uploadName);
      expect(files).toContain(imageName);
    });

    it('should resize image', async () => {
      const image = await Jimp.read(path.join(imageDir, imageName));
      expect(image.bitmap.width).toEqual(mockConfig.manipulation.imageWidth);
    });
  });

  describe('removeImage', () => {
    beforeEach(async () => {
      await new Jimp(100, 100).writeAsync(path.join(imageDir, imageName));
    });

    beforeEach(async () => {
      expect(await fs.readdir(imageDir)).toContain(imageName);
    });

    beforeEach(async () => {
      await service.removeImage(image);
    });

    it('should remove image', async () => {
      expect(await fs.readdir(imageDir)).not.toContain(imageName);
    });
  });

  afterEach(async () => {
    await fs.rm(imageDir, { recursive: true });
  });

  afterAll(async () => {
    // jimp dependency: wait for import in node_modules/gifwrap/src/gifcodec.js
    const waitForNextTick = async (): Promise<unknown> =>
      await new Promise((resolve) => nextTick(resolve));

    await waitForNextTick();
  });
});
