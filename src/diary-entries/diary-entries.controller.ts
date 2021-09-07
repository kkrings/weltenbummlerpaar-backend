import { Express } from 'express';

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { DiaryEntriesService } from './diary-entries.service';
import { MongoIdParams } from '../dto/mongo-id-params.dto';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto';
import { asDiaryEntryDto, DiaryEntryDto } from './dto/diary-entry.dto';
import { CreateImageDto } from './images/dto/create-image.dto';
import { RemoveImageParams } from './dto/remove-image-params.dto';

@ApiTags('Diary entries')
@Controller('diary-entries')
export class DiaryEntriesController {
  constructor(private readonly diaryEntriesService: DiaryEntriesService) {}

  @Post()
  async create(
    @Body() createDiaryEntryDto: CreateDiaryEntryDto,
  ): Promise<DiaryEntryDto> {
    return asDiaryEntryDto(
      await this.diaryEntriesService.create(createDiaryEntryDto),
    );
  }

  @Get()
  async findMany(): Promise<DiaryEntryDto[]> {
    const diaryEntries = await this.diaryEntriesService.findMany();
    return diaryEntries.map((diaryEntry) => asDiaryEntryDto(diaryEntry));
  }

  @Get(':id')
  async findOne(@Param() params: MongoIdParams): Promise<DiaryEntryDto> {
    return asDiaryEntryDto(await this.diaryEntriesService.findOne(params.id));
  }

  @Patch(':id')
  async updateOne(
    /* eslint-disable @typescript-eslint/indent */
    @Param() params: MongoIdParams,
    @Body() updateDiaryEntryDto: UpdateDiaryEntryDto,
    /* eslint-enable @typescript-eslint/indent */
  ): Promise<DiaryEntryDto> {
    return asDiaryEntryDto(
      await this.diaryEntriesService.updateOne(params.id, updateDiaryEntryDto),
    );
  }

  @Delete(':id')
  async removeOne(@Param() params: MongoIdParams): Promise<DiaryEntryDto> {
    return asDiaryEntryDto(await this.diaryEntriesService.removeOne(params.id));
  }

  @Post(':id/images')
  @UseInterceptors(FileInterceptor('imageUpload'))
  @ApiConsumes('multipart/form-data')
  async addImage(
    /* eslint-disable @typescript-eslint/indent */
    @Param() params: MongoIdParams,
    @UploadedFile() imageUpload: Express.Multer.File,
    @Body() createImageDto: CreateImageDto,
    /* eslint-enable @typescript-eslint/indent */
  ): Promise<DiaryEntryDto> {
    createImageDto.imageUpload = imageUpload.path;

    return asDiaryEntryDto(
      await this.diaryEntriesService.addImage(params.id, createImageDto),
    );
  }

  @Delete(':diaryEntryId/images/:imageId')
  async removeImage(
    @Param() params: RemoveImageParams,
  ): Promise<DiaryEntryDto> {
    return asDiaryEntryDto(
      await this.diaryEntriesService.removeImage(
        params.diaryEntryId,
        params.imageId,
      ),
    );
  }
}
