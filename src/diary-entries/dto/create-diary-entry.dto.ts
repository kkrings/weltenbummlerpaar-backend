import { OmitType } from '@nestjs/swagger'
import { DiaryEntryDto } from '../dto/diary-entry.dto'

export class CreateDiaryEntryDto extends (
  OmitType(DiaryEntryDto, ['id', 'images', 'createdAt', 'updatedAt'] as const)
) {}
