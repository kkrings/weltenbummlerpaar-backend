import { Injectable } from '@nestjs/common'
import { SearchTag } from './schemas/search-tag.schema'
import { DiaryEntry } from '../schemas/diary-entry.schema'
import { SearchTagsDBService } from './search-tags.db.service'

@Injectable()
export class SearchTagsService {
  constructor (private readonly searchTagsDBService: SearchTagsDBService) { }

  async findMany (): Promise<string[]> {
    const searchTags = await this.searchTagsDBService.findMany()
    return searchTags.map(searchTag => searchTag.searchTag)
  }

  async addDiaryEntryToMany (
    searchTags: string[],
    diaryEntry: DiaryEntry
  ): Promise<SearchTag[]> {
    return await Promise.all(
      searchTags.map(
        async searchTag => await this.searchTagsDBService.addDiaryEntryToOne(
          searchTag,
          diaryEntry
        )
      )
    )
  }

  async removeDiaryEntryFromMany (
    searchTags: string[],
    diaryEntry: DiaryEntry
  ): Promise<SearchTag[]> {
    return await Promise.all(
      searchTags.map(
        async searchTag => await this.removeDiaryEntryFromOne(
          searchTag,
          diaryEntry
        )
      )
    )
  }

  async updateMany (searchTags: string[], diaryEntry: DiaryEntry): Promise<void> {
    await this.addDiaryEntryToMany(
      searchTags.filter(searchTag => !diaryEntry.searchTags.includes(searchTag)),
      diaryEntry
    )

    await this.removeDiaryEntryFromMany(
      diaryEntry.searchTags.filter(searchTag => !searchTags.includes(searchTag)),
      diaryEntry
    )
  }

  protected async removeDiaryEntryFromOne (
    searchTag: string,
    diaryEntry: DiaryEntry
  ): Promise<SearchTag> {
    const searchTagDoc = await this.searchTagsDBService.removeDiaryEntryFromOne(
      searchTag,
      diaryEntry
    )

    if (searchTagDoc.diaryEntries.length === 0) {
      await this.searchTagsDBService.removeOne(searchTag)
    }

    return searchTagDoc
  }
}
