import * as mongoose from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type DiaryEntryDocument = DiaryEntry & mongoose.Document

@Schema({ timestamps: true })
export class DiaryEntry {
  /**
   * Diary entry's unique identifier
   */
  _id: string

  /**
   * Diary entry's title
   */
  @Prop({ required: true })
  title: string

  /**
   * Country, city, ..., the diary entry is about
   */
  @Prop({ required: true })
  location: string

  /**
   * Diary entry's content
   */
  @Prop({ required: true })
  body: string

  /**
   * Search tags the diary entry can be found with
   */
  @Prop()
  searchTags: string[]

  /**
   * Diary entry's creation date-time
   */
  createdAt: Date

  /**
   * Date-time the diary entry was last modified
   */
  updatedAt: Date
}

export const DiaryEntrySchema = SchemaFactory.createForClass(DiaryEntry)
