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
import { ImagesService } from './images/images.service'
import { MongoIdParams } from '../dto/mongo-id-params.dto'
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto'
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto'
import { asDiaryEntryDto, DiaryEntryDto } from './dto/diary-entry.dto'
import { CreateImageDto } from './images/dto/create-image.dto'
import { asImageDto, ImageDto } from './images/dto/image.dto'

@ApiTags('Diary entries')
@Controller('diary-entries')
export class DiaryEntriesController {
  constructor (
    private readonly diaryEntriesService: DiaryEntriesService,
    private readonly searchTagsService: SearchTagsService,
    private readonly imagesService: ImagesService
  ) {}

  @Post()
  async create (
    @Body() createDiaryEntryDto: CreateDiaryEntryDto
  ): Promise<DiaryEntryDto> {
    const diaryEntry = await this.diaryEntriesService.create(createDiaryEntryDto)

    await this.searchTagsService.addDiaryEntryToMany(
      createDiaryEntryDto.searchTags,
      diaryEntry
    )

    return asDiaryEntryDto(diaryEntry)
  }

  @Get()
  async findAll (): Promise<DiaryEntryDto[]> {
    const diaryEntries = await this.diaryEntriesService.findAll()
    return diaryEntries.map(diaryEntry => asDiaryEntryDto(diaryEntry))
  }

  @Get(':id')
  async findOne (@Param() params: MongoIdParams): Promise<DiaryEntryDto> {
    return asDiaryEntryDto(await this.diaryEntriesService.findOne(params.id))
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
      return asDiaryEntryDto(diaryEntry)
    }

    await this.searchTagsService.updateMany(
      updateDiaryEntryDto.searchTags,
      diaryEntry
    )

    return asDiaryEntryDto(await this.diaryEntriesService.findOne(params.id))
  }

  @Delete(':id')
  async remove (@Param() params: MongoIdParams): Promise<DiaryEntryDto> {
    const diaryEntry = await this.diaryEntriesService.remove(params.id)

    await this.searchTagsService.removeDiaryEntryFromMany(
      diaryEntry.searchTags,
      diaryEntry
    )

    await this.imagesService.removeMany(diaryEntry.images)

    return asDiaryEntryDto(diaryEntry)
  }

  @Post(':id/images')
  @UseInterceptors(FileInterceptor('imageUpload'))
  @ApiConsumes('multipart/form-data')
  async uploadImage (
    /* eslint-disable @typescript-eslint/indent */
    @Param() params: MongoIdParams,
    @UploadedFile() imageUpload: Express.Multer.File,
    @Body() createImageDto: CreateImageDto
    /* eslint-enable @typescript-eslint/indent */
  ): Promise<ImageDto> {
    const diaryEntry = await this.diaryEntriesService.findOne(params.id)
    const image = await this.imagesService.create(diaryEntry, createImageDto)
    await this.diaryEntriesService.addImage(params.id, image)
    return asImageDto(image)
  }
}
