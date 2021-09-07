import { Express } from 'express';
import { FileFilterCallback } from 'multer';
import {
  Inject,
  Injectable,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
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
    return {
      dest: this.config.destination,
      fileFilter: (_, file: Express.Multer.File, cb: FileFilterCallback) =>
        this.jpegFilter(file.mimetype, cb),
    };
  }

  jpegFilter(fileType: string, cb: FileFilterCallback): void {
    if (fileType === 'image/jpeg') {
      cb(null, true);
      return;
    }

    const error = new UnsupportedMediaTypeException(
      "A file of type 'image/jpeg' is expected.",
    );

    cb(error);
  }
}
