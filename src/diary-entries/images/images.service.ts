import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DiaryEntry } from '../schemas/diary-entry.schema'
import { CreateImageDto } from './dto/create-image.dto'
import { Image, ImageDocument } from './schemas/image.schema'

@Injectable()
export class ImagesService {
  constructor (
    @InjectModel(Image.name)
    private readonly imageModel: Model<ImageDocument>
  ) {}

  async create (
    diaryEntry: DiaryEntry,
    createImageDto: CreateImageDto
  ): Promise<Image> {
    return await this.imageModel.create({
      diaryEntryId: diaryEntry._id,
      ...createImageDto
    })
  }

  async removeMany (images: Image[]): Promise<number> {
    const result = await this.imageModel
      .deleteMany({ _id: { $in: images.map(image => image._id) } })
      .exec()

    return result.deletedCount ?? 0
  }
}
