import {
  Body,
  Controller,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { Express } from 'express';
import { appConstants } from './../../app.constants';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MongoIdParams } from '../../dto/mongo-id-params.dto';
import { asImageDto, ImageDto } from './dto/image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ImagesService } from './images.service';

@ApiTags(appConstants.apiTags.images)
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('imageUpload'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBadRequestResponse({ description: 'Failed validation' })
  @ApiUnauthorizedResponse({ description: 'Not authorized' })
  @ApiNotFoundResponse({ description: 'Image not found' })
  @ApiUnsupportedMediaTypeResponse({ description: 'JPEG expected' })
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
