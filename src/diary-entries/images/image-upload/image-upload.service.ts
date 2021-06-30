import * as path from 'path'
import * as jimp from 'jimp'
import { promises as fs } from 'fs'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Express } from 'express'
import { Image } from '../schemas/image.schema'
import imageUploadConfig from './image-upload.config'

@Injectable()
export class ImageUploadService {
  constructor (
    @Inject(imageUploadConfig.KEY)
    private readonly config: ConfigType<typeof imageUploadConfig>
  ) {}

  async moveImage (imageUpload: Express.Multer.File, image: Image): Promise<void> {
    const imageManipulator = await jimp.read(imageUpload.path)

    await imageManipulator
      .resize(this.config.imageManipulation.imageWidth, jimp.AUTO)
      .quality(this.config.imageManipulation.imageQuality)
      .writeAsync(path.join(imageUpload.destination, `${image._id.toHexString()}.jpg`))

    await fs.unlink(imageUpload.path)
  }
}
