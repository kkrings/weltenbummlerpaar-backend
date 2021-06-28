import { Controller, Get } from '@nestjs/common'
import { SearchTagsService } from './search-tags.service'

@Controller('search-tags')
export class SearchTagsController {
  constructor (private readonly searchTagsService: SearchTagsService) {}

  @Get()
  async findSearchTags (): Promise<string[]> {
    return await this.searchTagsService.findMany()
  }
}
