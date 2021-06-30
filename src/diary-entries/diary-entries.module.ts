import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DiaryEntriesService } from './diary-entries.service'
import { DiaryEntriesController } from './diary-entries.controller'
import { DiaryEntry, DiaryEntrySchema } from './schemas/diary-entry.schema'
import { SearchTagsModule } from './search-tags/search-tags.module'
import { ImagesModule } from './images/images.module'
import { ImageUploadModule } from './images/image-upload/image-upload.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DiaryEntry.name, schema: DiaryEntrySchema }
    ]),
    SearchTagsModule,
    ImagesModule,
    ImageUploadModule
  ],
  controllers: [DiaryEntriesController],
  providers: [DiaryEntriesService]
})
export class DiaryEntriesModule {}
