import * as mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type ImageDocument = Image & mongoose.Document

@Schema({ timestamps: true })
export class Image {
  _id: ObjectId

  @Prop({ required: true })
  description: string

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiaryEntry',
    required: true
  })
  diaryEntryId: ObjectId

  createdAt: Date
  updatedAt: Date
}

export const ImageSchema = SchemaFactory.createForClass(Image)
