import { PartialType } from '@nestjs/swagger'
import { IsMongoId } from 'class-validator'
import { CreateDiaryEntryDto } from './create-diary-entry.dto'

export class UpdateDiaryEntryDto extends PartialType(CreateDiaryEntryDto) {
  @IsMongoId({ each: true })
  images?: string[]
}
