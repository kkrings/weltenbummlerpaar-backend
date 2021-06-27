import * as mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseSchema } from 'src/schemas/base.schema'

export type SearchTagDocument = SearchTag & mongoose.Document

@Schema({ timestamps: true })
export class SearchTag extends BaseSchema {
  @Prop({ unique: true })
  searchTag: string

  @Prop({
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DiaryEntry'
    }]
  })
  diaryEntries: ObjectId[]
}

export const SearchTagSchema = SchemaFactory.createForClass(SearchTag)
