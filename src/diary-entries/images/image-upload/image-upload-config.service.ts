import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import imageUploadConfig from './image-upload.config';

@Injectable()
export class ImageUploadConfigService implements MulterOptionsFactory {
  constructor(
    @Inject(imageUploadConfig.KEY)
    private readonly config: ConfigType<typeof imageUploadConfig>,
  ) {}

  createMulterOptions(): MulterModuleOptions {
    return { dest: this.config.destination };
  }
}
