import { OmitType } from '@nestjs/swagger'
import { DiaryEntry } from '../entities/diary-entry.entity'

export class CreateDiaryEntryDto extends (
  OmitType(DiaryEntry, ['_id', 'createdAt', 'updatedAt'] as const)
) {}
