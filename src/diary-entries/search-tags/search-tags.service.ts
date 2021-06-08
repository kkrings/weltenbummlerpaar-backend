import { Error, Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SearchTag, SearchTagDocument } from './entities/search-tag.entity'
import { DiaryEntry } from '../entities/diary-entry.entity'

@Injectable()
export class SearchTagsService {
  constructor (
    @InjectModel(SearchTag.name)
    private readonly searchTagModel: Model<SearchTagDocument>
  ) { }

  async findSearchTags (): Promise<string[]> {
    const searchTagDocuments = await this.searchTagModel.find().exec()
    return searchTagDocuments.map(searchTag => searchTag.searchTag)
  }

  async addDiaryEntryToSearchTag (
    diaryEntry: DiaryEntry,
    searchTag: string
  ): Promise<SearchTag> {
    return await this.searchTagModel
      .findOneAndUpdate(
        { searchTag },
        { $addToSet: { diaryEntries: diaryEntry._id as any } },
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
        async searchTag => await this.addDiaryEntryToSearchTag(
          diaryEntry,
          searchTag
        )
      )
    )
  }

  async removeDiaryEntryFromSearchTag (
    diaryEntry: DiaryEntry,
    searchTag: string
  ): Promise<SearchTag> {
    const searchTagDocument = await this.searchTagModel
      .findOneAndUpdate(
        { searchTag },
        { $pull: { diaryEntries: diaryEntry._id as any } },
        { new: true }
      )
      .exec()

    if (searchTagDocument === null) {
      throw new Error.DocumentNotFoundError(`Search tag '${searchTag}' was not found.`)
    }

    if (searchTagDocument.diaryEntries.length === 0) {
      await searchTagDocument.remove()
    }

    return searchTagDocument
  }

  async removeDiaryEntryFromSearchTags (
    diaryEntry: DiaryEntry,
    searchTags: string[]
  ): Promise<SearchTag[]> {
    return await Promise.all(
      searchTags.map(
        async searchTag => await this.removeDiaryEntryFromSearchTag(
          diaryEntry,
          searchTag
        )
      )
    )
  }
}
