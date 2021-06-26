import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'
import { Image, ImageSchema } from './schemas/image.schema'
import { ImageUploadConfigService } from './image-upload/image-upload-config.service'
import { ImageUploadModule } from './image-upload/image-upload.module'
import { ImagesService } from './images.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Image.name, schema: ImageSchema }
    ]),
    MulterModule.registerAsync({
      imports: [ImageUploadModule],
      useExisting: ImageUploadConfigService
    })
  ],
  controllers: [],
  providers: [ImagesService],
  exports: [MulterModule, ImagesService]
})
export class ImagesModule {}
