import * as mongoose from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { DiaryEntry } from '../../entities/diary-entry.entity'

export type SearchTagDocument = SearchTag & mongoose.Document

@Schema({ timestamps: true })
export class SearchTag {
  @Prop({ unique: true })
  searchTag: string

  @Prop({
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DiaryEntry'
    }]
  })
  diaryEntries: DiaryEntry[]
}

export const SearchTagSchema = SchemaFactory.createForClass(SearchTag)
