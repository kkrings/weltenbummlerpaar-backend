import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../schemas/base.schema';
import { Image } from '../images/schemas/image.schema';

export type DiaryEntryDocument = DiaryEntry & mongoose.Document;

@Schema({ timestamps: true })
export class DiaryEntry extends BaseSchema {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  body: string;

  @Prop()
  searchTags: string[];

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
      },
    ],
  })
  images: Image[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Image' })
  previewImage?: Image;
}

const diaryEntrySchema = SchemaFactory.createForClass(DiaryEntry);
diaryEntrySchema.index({ createdAt: -1 });

export const DiaryEntrySchema = diaryEntrySchema;
