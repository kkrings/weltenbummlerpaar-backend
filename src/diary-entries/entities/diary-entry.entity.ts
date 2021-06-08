import * as mongoose from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ArrayUnique } from 'class-validator'

export type DiaryEntryDocument = DiaryEntry & mongoose.Document

@Schema({ timestamps: true })
export class DiaryEntry {
  /**
   * Diary entry's unique identifier
   * @example '60bfd78704a7f25279cfa06a'
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
  @ArrayUnique()
  @Prop()
  searchTags: string[] = []

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
