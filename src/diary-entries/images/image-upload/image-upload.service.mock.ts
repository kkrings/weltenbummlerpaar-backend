import { Injectable } from '@nestjs/common';
import { Image } from '../schemas/image.schema';
import { ImageUploadServiceBase } from './image-upload.service.base';

@Injectable()
export class ImageUploadServiceMock extends ImageUploadServiceBase {
  /* eslint-disable @typescript-eslint/no-empty-function */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  async moveImage(imageUploadPath: string, image: Image): Promise<void> {}
  async removeUpload(imageUploadPath: string): Promise<void> {}
  async removeImage(image: Image): Promise<void> {}
  /* eslint-enable @typescript-eslint/no-empty-function */
  /* eslint-enable @typescript-eslint/no-unused-vars */
}
