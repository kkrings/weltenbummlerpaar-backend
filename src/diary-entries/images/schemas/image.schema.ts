import * as mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../../schemas/base.schema';

export type ImageDocument = Image & mongoose.Document;

@Schema({ timestamps: true })
export class Image extends BaseSchema {
  @Prop({ required: true })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiaryEntry',
    required: true,
  })
  diaryEntryId: ObjectId;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
