import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Image } from '../entities/image.entity'

export class CreateImageDto extends OmitType(
  Image, ['id', 'diaryEntryId', 'createdAt', 'updatedAt']
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
  imageUpload: undefined
}
