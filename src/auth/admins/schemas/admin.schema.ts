import * as mongoose from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../../schemas/base.schema';

export type AdminDocument = Admin & mongoose.Document;

@Schema({ timestamps: true })
export class Admin extends BaseSchema {
  username: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
