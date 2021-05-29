import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SearchTagsService } from './search-tags.service'
import { SearchTagsController } from './search-tags.controller'
import { SearchTag, SearchTagSchema } from './schema/search-tag.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SearchTag.name, schema: SearchTagSchema }
    ])
  ],
  controllers: [SearchTagsController],
  providers: [SearchTagsService]
})
export class SearchTagsModule {}
