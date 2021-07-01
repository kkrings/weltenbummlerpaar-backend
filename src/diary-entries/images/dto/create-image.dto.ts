import { Express } from 'express'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { ImageDto } from './image.dto'

export class CreateImageDto extends OmitType(
  ImageDto, ['id', 'diaryEntryId', 'createdAt', 'updatedAt']
) {
  // for documentation purposes only; Multer "moves" imageUpload from the body to the
  // request
  /**
   * The actual uploaded image of type 'image/jpeg'
   */
  @ApiProperty({
    type: 'string',
    format: 'binary'
  })
  imageUpload: Express.Multer.File
}
