import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SearchTag, SearchTagDocument } from './schema/search-tag.schema'

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
}
