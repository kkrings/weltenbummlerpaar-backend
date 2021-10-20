import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { appConstants } from './../../app.constants';
import { FindManyQueryParams } from './dto/find-many-query-params.dto';
import { SearchTagsService } from './search-tags.service';

@ApiTags(appConstants.apiTags.searchTags)
@Controller('search-tags')
export class SearchTagsController {
  constructor(private readonly searchTagsService: SearchTagsService) {}

  @Get()
  async findMany(@Query() params: FindManyQueryParams): Promise<string[]> {
    return await this.searchTagsService.findMany(params);
  }
}
