import { OmitType } from '@nestjs/swagger'
import { DiaryEntry } from '../schema/diary-entry.schema'

export class CreateDiaryEntryDto extends (
  OmitType(DiaryEntry, ['id', 'searchTags', 'createdAt', 'updatedAt'] as const)
) {
  searchTags: string[] = []
}
