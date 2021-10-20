import { IsMongoId } from 'class-validator';

export class RemoveImageParams {
  /**
   * Diary entry's unique identifier
   */
  @IsMongoId()
  diaryEntryId: string;

  /**
   * Image's unique identifier
   */
  @IsMongoId()
  imageId: string;
}
