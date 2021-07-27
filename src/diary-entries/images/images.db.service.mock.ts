import { Inject, Injectable } from '@nestjs/common'
import { ObjectId } from 'mongodb'
import { throwOnNull } from 'src/schemas/base.schema'
import { DiaryEntry } from '../schemas/diary-entry.schema'
import { CreateImageDto } from './dto/create-image.dto'
import { UpdateImageDto } from './dto/update-image.dto'
import { ImagesDBServiceBase } from './images.db.service.base'
import { Image } from './schemas/image.schema'

@Injectable()
export class ImagesDBServiceMock extends ImagesDBServiceBase {
  constructor (
    @Inject('ImagesCollection')
    private readonly imagesCollection: Image[]
  ) {
    super()
  }

  async create (
    createImageDto: CreateImageDto,
    diaryEntry: DiaryEntry
  ): Promise<Image> {
    const createdAt = new Date()

    const image: Image = {
      _id: new ObjectId(),
      description: createImageDto.description,
      diaryEntryId: diaryEntry._id,
      createdAt: createdAt,
      updatedAt: createdAt
    }

    this.imagesCollection.push(image)

    return image
  }

  async updateOne (imageId: string, updateImageDto: UpdateImageDto): Promise<Image> {
    const image = await throwOnNull(imageId, async () => this.imagesCollection
      .filter(image => image._id.equals(imageId))
      .shift() ?? null
    )

    if (updateImageDto.description === undefined) {
      return image
    }

    image.description = updateImageDto.description
    image.updatedAt = new Date()

    return image
  }

  async removeOne (imageId: string): Promise<Image> {
    return await throwOnNull(imageId, async () => {
      const index = this.imagesCollection
        .map(image => image._id.toHexString())
        .indexOf(imageId)

      return index > -1 ? this.imagesCollection.splice(index, 1)[0] : null
    })
  }

  removeMany (images: Image[]): AsyncIterable<Image> {
    const removeImages = images.filter(
      other => this.imagesCollection.some(image => image._id.equals(other._id))
    )

    this.imagesCollection.splice(
      0, this.imagesCollection.length, ...this.imagesCollection.filter(
        other => !removeImages.some(image => image._id.equals(other._id))
      )
    )

    return removeImages[Symbol.asyncIterator]
  }
}
