import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SearchTag, SearchTagDocument } from './entities/search-tag.entity'
import { DiaryEntry } from '../entities/diary-entry.entity'

@Injectable()
export class SearchTagsService {
  constructor (
    @InjectModel(SearchTag.name)
    private readonly searchTagModel: Model<SearchTagDocument>
  ) {}

  async findSearchTags (): Promise<string[]> {
    const searchTags = await this.searchTagModel.find().exec()
    return searchTags.map(searchTag => searchTag.searchTag)
  }

  async addDiaryEntryToSearchTag (
    diaryEntry: DiaryEntry,
    searchTag: string
  ): Promise<SearchTag> {
    return await this.searchTagModel
      .findOneAndUpdate(
        { searchTag },
        { $addToSet: { diaryEntries: diaryEntry } },
        { new: true, upsert: true }
      )
      .exec()
  }

  async addDiaryEntryToSearchTags (
    diaryEntry: DiaryEntry,
    searchTags: string[]
  ): Promise<SearchTag[]> {
    return await Promise.all(
      searchTags.map(
        async searchTag => await this.addDiaryEntryToSearchTag(diaryEntry, searchTag)
      )
    )
  }
}
