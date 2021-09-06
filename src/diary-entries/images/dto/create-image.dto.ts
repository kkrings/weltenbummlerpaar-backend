import { ApiProperty, OmitType } from '@nestjs/swagger'
import { ImageDto } from './image.dto'

export class CreateImageDto extends OmitType(
  ImageDto, ['id', 'diaryEntryId', 'createdAt', 'updatedAt']
) {
  /**
   * The actual uploaded image of type 'image/jpeg'
   */
  @ApiProperty({
    type: 'string',
    format: 'binary'
  })
  imageUpload: string
  // Multer "moves" imageUpload from the body to the request
  // when used in service methods, it holds the path to the uploaded image
}
