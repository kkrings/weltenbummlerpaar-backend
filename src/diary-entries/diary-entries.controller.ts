import { Express } from 'express'

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common'

import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes, ApiTags } from '@nestjs/swagger'
import { DiaryEntriesService } from './diary-entries.service'
import { SearchTagsService } from './search-tags/search-tags.service'
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto'
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto'
import { DiaryEntry } from './entities/diary-entry.entity'
import { MongoIdParams } from '../dto/mongo-id-params.dto'
import { CreateImageDto } from './images/dto/create-image.dto'
import { Image } from './images/entities/image.entity'

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
  async findOne (@Param() params: MongoIdParams): Promise<DiaryEntry> {
    return await this.diaryEntriesService.findOne(params.id)
  }

  @Patch(':id')
  async update (
    @Param() params: MongoIdParams, @Body() updateDiaryEntry: UpdateDiaryEntryDto
  ): Promise<DiaryEntry> {
    const searchTagsUpdate = updateDiaryEntry.searchTags !== undefined

    const diaryEntry = await this.diaryEntriesService.update(
      params.id,
      updateDiaryEntry,
      !searchTagsUpdate
    )

    if (!searchTagsUpdate) {
      return diaryEntry
    }

    await this.searchTagsService.addDiaryEntryToNewSearchTags(
      diaryEntry,
      updateDiaryEntry.searchTags as string[]
    )

    await this.searchTagsService.removeDiaryEntryFromRemovedSearchTags(
      diaryEntry,
      updateDiaryEntry.searchTags as string[]
    )

    return await this.diaryEntriesService.findOne(params.id)
  }

  @Delete(':id')
  async remove (@Param() params: MongoIdParams): Promise<DiaryEntry> {
    const diaryEntry = await this.diaryEntriesService.remove(params.id)

    await this.searchTagsService.removeDiaryEntryFromSearchTags(
      diaryEntry,
      diaryEntry.searchTags
    )

    return diaryEntry
  }

  @Post(':id/images')
  @UseInterceptors(FileInterceptor('imageUpload'))
  @ApiConsumes('multipart/form-data')
  uploadImage (
    /* eslint-disable @typescript-eslint/indent */
    @Param() params: MongoIdParams,
    @UploadedFile() imageUpload: Express.Multer.File,
    @Body() createImageDto: CreateImageDto
    /* eslint-enable @typescript-eslint/indent */
  ): Image {
    return {
      id: '60d468d1f33a8412d3cec16f',
      description: createImageDto.description,
      diaryEntryId: params.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
}
