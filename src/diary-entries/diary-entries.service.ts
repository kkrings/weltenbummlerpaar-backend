import { Injectable } from '@nestjs/common'
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto'
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto'

@Injectable()
export class DiaryEntriesService {
  create (createDiaryEntryDto: CreateDiaryEntryDto): string {
    return 'This action adds a new diaryEntry'
  }

  findAll (): string {
    return 'This action returns all diaryEntries'
  }

  findOne (id: number): string {
    return `This action returns a #${id} diaryEntry`
  }

  update (id: number, updateDiaryEntryDto: UpdateDiaryEntryDto): string {
    return `This action updates a #${id} diaryEntry`
  }

  remove (id: number): string {
    return `This action removes a #${id} diaryEntry`
  }
}
