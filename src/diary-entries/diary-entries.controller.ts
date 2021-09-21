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
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { DiaryEntriesService } from './diary-entries.service';
import { MongoIdParams } from '../dto/mongo-id-params.dto';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto';
import { asDiaryEntryDto, DiaryEntryDto } from './dto/diary-entry.dto';
import { CreateImageDto } from './images/dto/create-image.dto';
import { RemoveImageParams } from './dto/remove-image-params.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Diary entries')
@Controller('diary-entries')
export class DiaryEntriesController {
  constructor(private readonly diaryEntriesService: DiaryEntriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Not authorized' })
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
  @ApiNotFoundResponse({ description: 'Diary entry not found' })
  async findOne(@Param() params: MongoIdParams): Promise<DiaryEntryDto> {
    return asDiaryEntryDto(await this.diaryEntriesService.findOne(params.id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Not authorized' })
  @ApiNotFoundResponse({ description: 'Diary entry not found' })
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Not authorized' })
  @ApiNotFoundResponse({ description: 'Diary entry not found' })
  async removeOne(@Param() params: MongoIdParams): Promise<DiaryEntryDto> {
    return asDiaryEntryDto(await this.diaryEntriesService.removeOne(params.id));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/images')
  @UseInterceptors(FileInterceptor('imageUpload'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Not authorized' })
  @ApiNotFoundResponse({ description: 'Diary entry not found' })
  @ApiUnsupportedMediaTypeResponse({ description: 'JPEG expected' })
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

  @UseGuards(JwtAuthGuard)
  @Delete(':diaryEntryId/images/:imageId')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Not authorized' })
  @ApiNotFoundResponse({ description: 'Diary entry or image not found' })
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
