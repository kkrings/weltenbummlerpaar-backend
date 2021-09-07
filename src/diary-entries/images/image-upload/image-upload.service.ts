import * as Jimp from 'jimp';
import * as path from 'path';
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
    const imageManipulator = await Jimp.read(imageUploadPath);

    await imageManipulator
      .resize(this.config.manipulation.imageWidth, Jimp.AUTO)
      .quality(this.config.manipulation.imageQuality)
      .writeAsync(this.imagePath(image));

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
