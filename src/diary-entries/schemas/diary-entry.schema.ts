import * as mongoose from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type DiaryEntryDocument = DiaryEntry & mongoose.Document

@Schema({ timestamps: true })
export class DiaryEntry {
  _id: mongoose.Types.ObjectId

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  location: string

  @Prop({ required: true })
  body: string

  @Prop()
  searchTags: string[] = []
}

export const DiaryEntrySchema = SchemaFactory.createForClass(DiaryEntry)
