import * as mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Image } from '../images/schemas/image.schema'

export type DiaryEntryDocument = DiaryEntry & mongoose.Document

@Schema({ timestamps: true })
export class DiaryEntry {
  _id: ObjectId

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  location: string

  @Prop({ required: true })
  body: string

  @Prop()
  searchTags: string[]

  @Prop({
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image'
    }]
  })
  images: Image[]

  createdAt: Date
  updatedAt: Date
}

export const DiaryEntrySchema = SchemaFactory.createForClass(DiaryEntry)
