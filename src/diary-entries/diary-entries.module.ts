import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DiaryEntriesService } from './diary-entries.service'
import { DiaryEntriesController } from './diary-entries.controller'
import { DiaryEntry, DiaryEntrySchema } from './schemas/diary-entry.schema'
import { SearchTagsModule } from './search-tags/search-tags.module'
import { ImagesModule } from './images/images.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DiaryEntry.name, schema: DiaryEntrySchema }
    ]),
    SearchTagsModule,
    ImagesModule
  ],
  controllers: [DiaryEntriesController],
  providers: [DiaryEntriesService]
})
export class DiaryEntriesModule {}
