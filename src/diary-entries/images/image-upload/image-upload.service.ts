import * as path from 'path';
import * as sharp from 'sharp';
import { promises as fs } from 'fs';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ImageUploadServiceBase } from './image-upload.service.base';
import { Image } from '../schemas/image.schema';
import imageUploadConfig from './image-upload.config';

@Injectable()
export class ImageUploadService extends ImageUploadServiceBase {
  constructor(
    @Inject(imageUploadConfig.KEY)
    private readonly config: ConfigType<typeof imageUploadConfig>,
  ) {
    super();
  }

  async moveImage(imageUploadPath: string, image: Image): Promise<void> {
    await sharp(imageUploadPath)
      .resize(this.config.manipulation.imageWidth)
      .jpeg({ quality: this.config.manipulation.imageQuality })
      .toFile(this.imagePath(image));

    await this.removeUpload(imageUploadPath);
  }

  async removeUpload(imageUploadPath: string): Promise<void> {
    await fs.unlink(imageUploadPath);
  }

  async removeImage(image: Image): Promise<void> {
    await fs.unlink(this.imagePath(image));
  }

  private imagePath(image: Image): string {
    return path.join(this.config.destination, `${image._id.toHexString()}.jpg`);
  }
}
