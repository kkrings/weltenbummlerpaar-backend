import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

import { SearchTag } from '../search-tags/schema/search-tag.schema'

export type DiaryEntryDocument = DiaryEntry & mongoose.Document

@Schema({ timestamps: true })
export class DiaryEntry {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  location: string

  @Prop({ required: true })
  body: string

  @Prop({
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SearchTag'
    }],
    index: true
  })
  searchTags: SearchTag[]
}

export const DiaryEntrySchema = SchemaFactory.createForClass(DiaryEntry)
