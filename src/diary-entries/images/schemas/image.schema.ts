import * as mongoose from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { DiaryEntry } from '../../schemas/diary-entry.schema'

export type ImageDocument = Image & mongoose.Document

@Schema({ timestamps: true })
export class Image {
  @Prop({ required: true })
  description: string

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiaryEntry'
  })
  diaryEntry: DiaryEntry
}

export const ImageSchema = SchemaFactory.createForClass(Image)
