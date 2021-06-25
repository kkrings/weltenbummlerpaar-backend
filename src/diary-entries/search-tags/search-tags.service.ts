import { Model } from 'mongoose'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SearchTag, SearchTagDocument } from './schemas/search-tag.schema'
import { DiaryEntry } from '../schemas/diary-entry.schema'

@Injectable()
export class SearchTagsService {
  constructor (
    @InjectModel(SearchTag.name)
    private readonly searchTagModel: Model<SearchTagDocument>
  ) { }

  async findSearchTags (): Promise<string[]> {
    const searchTags = await this.searchTagModel
      .find()
      .sort({ searchTag: 'ascending' })
      .exec()

    return searchTags.map(searchTag => searchTag.searchTag)
  }

  async addDiaryEntryToSearchTag (
    diaryEntry: DiaryEntry,
    searchTag: string
  ): Promise<SearchTag> {
    return await this.searchTagModel
      .findOneAndUpdate(
        { searchTag },
        { $addToSet: { diaryEntries: diaryEntry._id } },
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

  async addDiaryEntryToNewSearchTags (
    diaryEntry: DiaryEntry,
    searchTags: string[]
  ): Promise<SearchTag[]> {
    const addSearchTags = searchTags.filter(
      searchTag => !diaryEntry.searchTags.includes(searchTag)
    )

    return await this.addDiaryEntryToSearchTags(diaryEntry, addSearchTags)
  }

  async removeDiaryEntryFromSearchTag (
    diaryEntry: DiaryEntry,
    searchTag: string
  ): Promise<SearchTag> {
    const searchTagDocument = await this.searchTagModel
      .findOneAndUpdate(
        { searchTag },
        { $pull: { diaryEntries: diaryEntry._id } },
        { new: true }
      )
      .exec()

    if (searchTagDocument === null) {
      throw new NotFoundException(`Search tag '${searchTag}' was not found.`)
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

  async removeDiaryEntryFromRemovedSearchTags (
    diaryEntry: DiaryEntry,
    searchTags: string[]
  ): Promise<SearchTag[]> {
    const removeSearchTags = diaryEntry.searchTags.filter(
      searchTag => !searchTags.includes(searchTag)
    )

    return await this.removeDiaryEntryFromSearchTags(
      diaryEntry,
      removeSearchTags
    )
  }
}
