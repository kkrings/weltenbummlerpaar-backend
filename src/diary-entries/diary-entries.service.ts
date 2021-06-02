import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { DiaryEntry, DiaryEntryDocument } from './schema/diary-entry.schema'
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto'
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto'
import { SearchTagsService } from './search-tags/search-tags.service'

@Injectable()
export class DiaryEntriesService {
  constructor (
    @InjectModel(DiaryEntry.name)
    private readonly diaryEntryModel: Model<DiaryEntryDocument>,
    private readonly searchTagsService: SearchTagsService
  ) {}

  async create (createDiaryEntryDto: CreateDiaryEntryDto): Promise<DiaryEntry> {
    const diaryEntry = await this.diaryEntryModel.create({
      title: createDiaryEntryDto.title,
      location: createDiaryEntryDto.location,
      body: createDiaryEntryDto.body
    })

    const searchTags = await this.searchTagsService.addDiaryEntryToSearchTags(
      diaryEntry,
      createDiaryEntryDto.searchTags
    )

    diaryEntry.searchTags.push(...searchTags)

    return await diaryEntry.save()
  }

  async findAll (): Promise<DiaryEntry[]> {
    return await this.diaryEntryModel.find()
      .populate('searchTags')
      .exec()
  }

  findOne (id: number): string {
    return `This action returns a #${id} diaryEntry`
  }

  update (id: number, updateDiaryEntryDto: UpdateDiaryEntryDto): string {
    return `This action updates a #${id} diaryEntry`
  }

  remove (id: number): string {
    return `This action removes a #${id} diaryEntry`
  }
}
