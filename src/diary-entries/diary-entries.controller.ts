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
import { DiaryEntry } from './schemas/diary-entry.schema'
import { MongoIdParams } from '../dto/mongo-id-params.dto'
import { CreateImageDto } from './images/dto/create-image.dto'
import { Image } from './images/entities/image.entity'
import { DiaryEntryDto } from './dto/diary-entry.dto'

@ApiTags('Diary entries')
@Controller('diary-entries')
export class DiaryEntriesController {
  constructor (
    private readonly diaryEntriesService: DiaryEntriesService,
    private readonly searchTagsService: SearchTagsService
  ) {}

  @Post()
  async create (
    @Body() createDiaryEntryDto: CreateDiaryEntryDto
  ): Promise<DiaryEntryDto> {
    const diaryEntry = await this.diaryEntriesService.create(createDiaryEntryDto)

    await this.searchTagsService.addDiaryEntryToSearchTags(
      diaryEntry,
      createDiaryEntryDto.searchTags
    )

    return this.diaryEntryAsDto(diaryEntry)
  }

  @Get()
  async findAll (): Promise<DiaryEntryDto[]> {
    const diaryEntries = await this.diaryEntriesService.findAll()
    return diaryEntries.map(diaryEntry => this.diaryEntryAsDto(diaryEntry))
  }

  @Get(':id')
  async findOne (@Param() params: MongoIdParams): Promise<DiaryEntryDto> {
    return this.diaryEntryAsDto(await this.diaryEntriesService.findOne(params.id))
  }

  @Patch(':id')
  async update (
    @Param() params: MongoIdParams, @Body() updateDiaryEntryDto: UpdateDiaryEntryDto
  ): Promise<DiaryEntryDto> {
    const diaryEntry = await this.diaryEntriesService.update(
      params.id,
      updateDiaryEntryDto,
      updateDiaryEntryDto.searchTags === undefined
    )

    if (updateDiaryEntryDto.searchTags === undefined) {
      return this.diaryEntryAsDto(diaryEntry)
    }

    await this.searchTagsService.addDiaryEntryToNewSearchTags(
      diaryEntry,
      updateDiaryEntryDto.searchTags
    )

    await this.searchTagsService.removeDiaryEntryFromRemovedSearchTags(
      diaryEntry,
      updateDiaryEntryDto.searchTags
    )

    return this.diaryEntryAsDto(await this.diaryEntriesService.findOne(params.id))
  }

  @Delete(':id')
  async remove (@Param() params: MongoIdParams): Promise<DiaryEntryDto> {
    const diaryEntry = await this.diaryEntriesService.remove(params.id)

    await this.searchTagsService.removeDiaryEntryFromSearchTags(
      diaryEntry,
      diaryEntry.searchTags
    )

    return this.diaryEntryAsDto(diaryEntry)
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

  private diaryEntryAsDto (diaryEntry: DiaryEntry): DiaryEntryDto {
    return {
      id: diaryEntry._id.toHexString(),
      title: diaryEntry.title,
      location: diaryEntry.location,
      body: diaryEntry.body,
      searchTags: diaryEntry.searchTags,
      createdAt: diaryEntry.createdAt,
      updatedAt: diaryEntry.updatedAt
    }
  }
}
