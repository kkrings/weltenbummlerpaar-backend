import { Injectable } from '@nestjs/common'
import { Image } from '../schemas/image.schema'
import { ImageUploadServiceBase } from './image-upload.service.base'

@Injectable()
export class ImageUploadServiceMock extends ImageUploadServiceBase {
  async moveImage (imageUploadPath: string, image: Image): Promise<void> {}
  async removeUpload (imageUploadPath: string): Promise<void> {}
  async removeImage (image: Image): Promise<void> {}
}
