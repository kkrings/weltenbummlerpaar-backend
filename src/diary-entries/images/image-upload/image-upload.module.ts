import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ImageUploadConfigService } from './image-upload-config.service'
import imageUploadConfig from './image-upload.config'

@Module({
  imports: [ConfigModule.forFeature(imageUploadConfig)],
  controllers: [],
  providers: [ImageUploadConfigService],
  exports: [ImageUploadConfigService]
})
export class ImageUploadModule {}
