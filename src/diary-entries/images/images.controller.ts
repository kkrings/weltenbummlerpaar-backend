import {
  Body,
  Controller,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { MongoIdParams } from '../../dto/mongo-id-params.dto';
import { asImageDto, ImageDto } from './dto/image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ImagesService } from './images.service';

@ApiTags('Diary entry images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imageUpload'))
  @ApiConsumes('multipart/form-data')
  async updateOne(
    /* eslint-disable @typescript-eslint/indent */
    @Param() params: MongoIdParams,
    @Body() updateImageDto: UpdateImageDto,
    @UploadedFile() imageUpload?: Express.Multer.File,
    /* eslint-enable @typescript-eslint/indent */
  ): Promise<ImageDto> {
    updateImageDto.imageUpload = imageUpload?.path;
    return asImageDto(
      await this.imagesService.updateOne(params.id, updateImageDto),
    );
  }
}
