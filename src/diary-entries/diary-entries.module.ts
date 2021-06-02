import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DiaryEntriesService } from './diary-entries.service'
import { DiaryEntriesController } from './diary-entries.controller'
import { DiaryEntry, DiaryEntrySchema } from './entities/diary-entry.entity'
import { SearchTagsModule } from './search-tags/search-tags.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DiaryEntry.name, schema: DiaryEntrySchema }
    ]),
    SearchTagsModule
  ],
  controllers: [DiaryEntriesController],
  providers: [DiaryEntriesService]
})
export class DiaryEntriesModule {}
