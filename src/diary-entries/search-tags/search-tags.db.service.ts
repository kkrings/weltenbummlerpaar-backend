import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DiaryEntry } from '../schemas/diary-entry.schema'
import { SearchTag, SearchTagDocument } from './schemas/search-tag.schema'
import { SearchTagsDBServiceBase } from './search-tags.db.service.base'

@Injectable()
export class SearchTagsDBService extends SearchTagsDBServiceBase {
  constructor (
    @InjectModel(SearchTag.name)
    private readonly searchTagModel: Model<SearchTagDocument>
  ) {
    super()
  }

  async findMany (): Promise<SearchTag[]> {
    return await this.searchTagModel
      .find()
      .sort({ searchTag: 'ascending' })
      .exec()
  }

  async removeOne (searchTag: string): Promise<SearchTag | null> {
    return await this.searchTagModel.findOneAndRemove({ searchTag }).exec()
  }

  async addDiaryEntryToOne (
    searchTag: string,
    diaryEntry: DiaryEntry
  ): Promise<SearchTag> {
    return await this.searchTagModel
      .findOneAndUpdate(
        { searchTag },
        { $addToSet: { diaryEntries: diaryEntry._id } },
        { new: true, upsert: true }
      )
      .exec()
  }

  async removeDiaryEntryFromOne (
    searchTag: string,
    diaryEntry: DiaryEntry
  ): Promise<SearchTag | null> {
    return await this.searchTagModel
      .findOneAndUpdate(
        { searchTag },
        { $pull: { diaryEntries: diaryEntry._id } },
        { new: true }
      )
      .exec()
  }
}
