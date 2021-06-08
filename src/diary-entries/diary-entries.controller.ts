import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'
import { DiaryEntriesService } from './diary-entries.service'
import { SearchTagsService } from './search-tags/search-tags.service'
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto'
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto'
import { DiaryEntry } from './entities/diary-entry.entity'

@ApiTags('Diary entries')
@Controller('diary-entries')
export class DiaryEntriesController {
  constructor (
    private readonly diaryEntriesService: DiaryEntriesService,
    private readonly searchTagsService: SearchTagsService
  ) {}

  @Post()
  async create (@Body() createDiaryEntryDto: CreateDiaryEntryDto): Promise<DiaryEntry> {
    const diaryEntry = await this.diaryEntriesService.create(createDiaryEntryDto)

    await this.searchTagsService.addDiaryEntryToSearchTags(
      diaryEntry,
      createDiaryEntryDto.searchTags
    )

    return diaryEntry
  }

  @Get()
  async findAll (): Promise<DiaryEntry[]> {
    return await this.diaryEntriesService.findAll()
  }

  @Get(':id')
  findOne (@Param('id') id: string): string {
    return this.diaryEntriesService.findOne(+id)
  }

  @Patch(':id')
  update (
    @Param('id') id: string, @Body() updateDiaryEntry: UpdateDiaryEntryDto
  ): string {
    return this.diaryEntriesService.update(+id, updateDiaryEntry)
  }

  @Delete(':id')
  remove (@Param('id') id: string): string {
    return this.diaryEntriesService.remove(+id)
  }
}
