import { OmitType } from '@nestjs/swagger'
import { DiaryEntry } from '../entities/diary-entry.entity'

export class CreateDiaryEntryDto extends (
  OmitType(DiaryEntry, ['id', 'searchTags', 'createdAt', 'updatedAt'] as const)
) {
  searchTags: string[] = []
}
