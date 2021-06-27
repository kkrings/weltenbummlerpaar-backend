import * as mongoose from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseSchema } from 'src/schemas/base.schema'
import { Image } from '../images/schemas/image.schema'

export type DiaryEntryDocument = DiaryEntry & mongoose.Document

@Schema({ timestamps: true })
export class DiaryEntry extends BaseSchema {
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
}

export const DiaryEntrySchema = SchemaFactory.createForClass(DiaryEntry)
