import { IsMongoId } from 'class-validator'

export class RemoveImageParams {
  @IsMongoId()
  diaryEntryId: string

  @IsMongoId()
  imageId: string
}
