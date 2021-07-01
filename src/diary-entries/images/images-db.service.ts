import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DiaryEntry } from '../schemas/diary-entry.schema'
import { CreateImageDto } from './dto/create-image.dto'
import { UpdateImageDto } from './dto/update-image.dto'
import { Image, ImageDocument } from './schemas/image.schema'

@Injectable()
export class ImagesDBService {
  constructor (
    @InjectModel(Image.name)
    private readonly imageModel: Model<ImageDocument>
  ) {}

  async create (
    createImageDto: CreateImageDto,
    diaryEntry: DiaryEntry
  ): Promise<Image> {
    return await this.imageModel.create({
      ...createImageDto,
      diaryEntryId: diaryEntry._id
    })
  }

  async updateOne (
    imageId: string,
    updateImageDto: UpdateImageDto
  ): Promise<Image | null> {
    return await this.imageModel
      .findByIdAndUpdate(imageId, { $set: updateImageDto }, { new: true })
      .exec()
  }

  async removeOne (imageId: string): Promise<Image | null> {
    return await this.imageModel.findByIdAndRemove(imageId).exec()
  }

  removeMany (images: Image[]): AsyncIterable<Image> {
    return this.imageModel.deleteMany({ _id: { $in: images.map(image => image._id) } })
  }
}
