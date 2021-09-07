import { IsMongoId } from 'class-validator';
import { Image } from '../schemas/image.schema';

export class ImageDto {
  /**
   * Image's unique identifier
   * @example '60d468d1f33a8412d3cec16f'
   */
  @IsMongoId()
  id: string;

  /**
   * Image's description
   */
  description: string;

  /**
   * Diary entry's unique identifier the image belongs to
   * @example '60bfd78704a7f25279cfa06a'
   */
  @IsMongoId()
  diaryEntryId: string;

  /**
   * Image's creation date-time
   */
  createdAt: Date;

  /**
   * Date-time the image was last modified
   */
  updatedAt: Date;
}

export function asImageDto(image: Image): ImageDto {
  return {
    id: image._id.toHexString(),
    description: image.description,
    diaryEntryId: image.diaryEntryId.toHexString(),
    createdAt: image.createdAt,
    updatedAt: image.updatedAt,
  };
}
