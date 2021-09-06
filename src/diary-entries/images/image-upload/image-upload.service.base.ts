import { Image } from '../schemas/image.schema'

export abstract class ImageUploadServiceBase {
  abstract moveImage (imageUploadPath: string, image: Image): Promise<void>
  abstract removeUpload (imageUploadPath: string): Promise<void>
  abstract removeImage (image: Image): Promise<void>
}
