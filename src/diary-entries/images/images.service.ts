import { Injectable } from '@nestjs/common'
import { DiaryEntry } from '../schemas/diary-entry.schema'
import { CreateImageDto } from './dto/create-image.dto'
import { UpdateImageDto } from './dto/update-image.dto'
import { ImageUploadService } from './image-upload/image-upload.service'
import { ImagesDBService } from './images.db.service'
import { Image } from './schemas/image.schema'

@Injectable()
export class ImagesService {
  constructor (
    private readonly imageDBService: ImagesDBService,
    private readonly imageUploadService: ImageUploadService
  ) {}

  async create (
    createImageDto: CreateImageDto,
    diaryEntry: DiaryEntry
  ): Promise<Image> {
    const image = await this.imageDBService.create(createImageDto, diaryEntry)
    await this.imageUploadService.moveImage(createImageDto.imageUpload.path, image)
    return image
  }

  async updateOne (imageId: string, updateImageDto: UpdateImageDto): Promise<Image> {
    const image = await this.imageDBService.updateOne(imageId, updateImageDto)

    if (updateImageDto.imageUpload !== undefined) {
      await this.imageUploadService.moveImage(updateImageDto.imageUpload.path, image)
    }

    return image
  }

  async removeOne (imageId: string): Promise<Image> {
    const image = await this.imageDBService.removeOne(imageId)
    await this.imageUploadService.removeImage(image)
    return image
  }

  async removeMany (images: Image[]): Promise<void> {
    for await (const image of this.imageDBService.removeMany(images)) {
      await this.imageUploadService.removeImage(image)
    }
  }
}
