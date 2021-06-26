import { Model } from 'mongoose'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { DiaryEntry, DiaryEntryDocument } from './schemas/diary-entry.schema'
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto'
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto'
import { Image } from './images/schemas/image.schema'

@Injectable()
export class DiaryEntriesService {
  constructor (
    @InjectModel(DiaryEntry.name)
    private readonly diaryEntryModel: Model<DiaryEntryDocument>
  ) {}

  async create (createDiaryEntryDto: CreateDiaryEntryDto): Promise<DiaryEntry> {
    return await this.diaryEntryModel.create(createDiaryEntryDto)
  }

  async findAll (): Promise<DiaryEntry[]> {
    return await this.diaryEntryModel.find().populate('images').exec()
  }

  async findOne (id: string): Promise<DiaryEntry> {
    const diaryEntry = await this.diaryEntryModel
      .findById(id)
      .populate('images')
      .exec()

    return this.checkDiaryEntryFound(id, diaryEntry)
  }

  async update (
    id: string,
    updateDiaryEntryDto: UpdateDiaryEntryDto,
    returnUpdated = true
  ): Promise<DiaryEntry> {
    const diaryEntry = await this.diaryEntryModel
      .findByIdAndUpdate(id, { $set: updateDiaryEntryDto }, { new: returnUpdated })
      .populate('images')
      .exec()

    return this.checkDiaryEntryFound(id, diaryEntry)
  }

  async addImage (id: string, image: Image): Promise<DiaryEntry> {
    const diaryEntry = await this.diaryEntryModel
      .findByIdAndUpdate(id, { $push: { images: image._id } }, { new: true })
      .populate('images')
      .exec()

    return this.checkDiaryEntryFound(id, diaryEntry)
  }

  async remove (id: string): Promise<DiaryEntry> {
    const diaryEntry = await this.diaryEntryModel
      .findByIdAndRemove(id)
      .populate('images')
      .exec()

    return this.checkDiaryEntryFound(id, diaryEntry)
  }

  private checkDiaryEntryFound (id: string, diaryEntry: DiaryEntry | null): DiaryEntry {
    if (diaryEntry === null) {
      throw new NotFoundException(`Diary entry with ID '${id}' was not found.`)
    }

    return diaryEntry
  }
}
