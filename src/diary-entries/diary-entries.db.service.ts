import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { throwOnNull } from '../schemas/base.schema'
import { DiaryEntriesDBServiceBase } from './diary-entries.db.service.base'
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto'
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto'
import { Image } from './images/schemas/image.schema'
import { DiaryEntry, DiaryEntryDocument } from './schemas/diary-entry.schema'

@Injectable()
export class DiaryEntriesDBService extends DiaryEntriesDBServiceBase {
  constructor (
    @InjectModel(DiaryEntry.name)
    private readonly diaryEntryModel: Model<DiaryEntryDocument>
  ) {
    super()
  }

  async create (createDiaryEntryDto: CreateDiaryEntryDto): Promise<DiaryEntry> {
    return await this.diaryEntryModel.create(createDiaryEntryDto)
  }

  async findMany (): Promise<DiaryEntry[]> {
    return await this.diaryEntryModel.find().populate('images').exec()
  }

  async findOne (diaryEntryId: string): Promise<DiaryEntry> {
    return await throwOnNull(diaryEntryId, async () => await this.diaryEntryModel
      .findById(diaryEntryId)
      .populate('images')
      .exec()
    )
  }

  async updateOne (
    diaryEntryId: string,
    updateDiaryEntryDto: UpdateDiaryEntryDto
  ): Promise<DiaryEntry> {
    return await throwOnNull(diaryEntryId, async () => await this.diaryEntryModel
      .findByIdAndUpdate(
        diaryEntryId,
        { $set: updateDiaryEntryDto as any },
        { new: true }
      )
      .populate('images')
      .exec()
    )
  }

  async removeOne (diaryEntryId: string): Promise<DiaryEntry> {
    return await throwOnNull(diaryEntryId, async () => await this.diaryEntryModel
      .findByIdAndRemove(diaryEntryId)
      .populate('images')
      .exec()
    )
  }

  async addImage (diaryEntryId: string, image: Image): Promise<DiaryEntry> {
    return await throwOnNull(diaryEntryId, async () => await this.diaryEntryModel
      .findByIdAndUpdate(diaryEntryId, { $push: { images: image._id } }, { new: true })
      .populate('images')
      .exec()
    )
  }

  async removeImage (diaryEntryId: string, image: Image): Promise<DiaryEntry> {
    return await throwOnNull(diaryEntryId, async () => await this.diaryEntryModel
      .findByIdAndUpdate(diaryEntryId, { $pull: { images: image._id } }, { new: true })
      .populate('images')
      .exec()
    )
  }
}
