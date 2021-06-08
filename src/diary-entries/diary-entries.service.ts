import { Error, Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { DiaryEntry, DiaryEntryDocument } from './entities/diary-entry.entity'
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto'
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto'

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
    return await this.diaryEntryModel.find().exec()
  }

  findOne (id: number): string {
    return `This action returns a #${id} diaryEntry`
  }

  update (id: number, updateDiaryEntryDto: UpdateDiaryEntryDto): string {
    return `This action updates a #${id} diaryEntry`
  }

  async remove (id: string): Promise<DiaryEntry> {
    const diaryEntry = await this.diaryEntryModel.findByIdAndRemove(id).exec()

    if (diaryEntry === null) {
      throw new Error.DocumentNotFoundError(
        `Diary entry with ID '${id}' was not found.`
      )
    }

    return diaryEntry
  }
}
