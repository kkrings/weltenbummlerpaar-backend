import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchTagsService } from './search-tags.service';

@ApiTags('Diary entry search tags')
@Controller('search-tags')
export class SearchTagsController {
  constructor(private readonly searchTagsService: SearchTagsService) {}

  @Get()
  async findMany(): Promise<string[]> {
    return await this.searchTagsService.findMany();
  }
}