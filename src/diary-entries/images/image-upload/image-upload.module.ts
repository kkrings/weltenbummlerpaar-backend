import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImageUploadService } from './image-upload.service';
import { ImageUploadConfigService } from './image-upload-config.service';
import imageUploadConfig from './image-upload.config';

@Module({
  imports: [ConfigModule.forFeature(imageUploadConfig)],
  providers: [ImageUploadService, ImageUploadConfigService],
  exports: [ImageUploadService, ImageUploadConfigService],
})
export class ImageUploadModule {}
