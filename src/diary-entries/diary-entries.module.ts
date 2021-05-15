import { Module } from '@nestjs/common'
import { DiaryEntriesService } from './diary-entries.service'
import { DiaryEntriesController } from './diary-entries.controller'

@Module({
  controllers: [DiaryEntriesController],
  providers: [DiaryEntriesService]
})
export class DiaryEntriesModule {}
