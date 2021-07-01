import * as jimp from 'jimp'
import * as path from 'path'
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
      .resize(this.config.manipulation.imageWidth, jimp.AUTO)
      .quality(this.config.manipulation.imageQuality)
      .writeAsync(this.imagePath(image))

    await fs.unlink(imageUpload.path)
  }

  async removeImage (image: Image): Promise<void> {
    await fs.unlink(this.imagePath(image))
  }

  private imagePath (image: Image): string {
    return path.join(this.config.destination, `${image._id.toHexString()}.jpg`)
  }
}
