import { Express } from 'express'
import { FileFilterCallback } from 'multer'
import { Inject, Injectable, UnsupportedMediaTypeException } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express'
import imageUploadConfig from './image-upload.config'

const jpegFilter = (_, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(new UnsupportedMediaTypeException('A file of type \'image/jpeg\' is expected.'))
  }
}

@Injectable()
export class ImageUploadConfigService implements MulterOptionsFactory {
  constructor (
    @Inject(imageUploadConfig.KEY)
    private readonly config: ConfigType<typeof imageUploadConfig>
  ) {}

  createMulterOptions (): MulterModuleOptions {
    return {
      dest: this.config.destination,
      fileFilter: jpegFilter
    }
  }
}
