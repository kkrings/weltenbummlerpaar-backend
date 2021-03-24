/**
 * User authentication model
 * @module models/admin
 */

import { model, PassportLocalDocument, PassportLocalSchema, Schema } from 'mongoose';
import * as passportLocalMongoose from 'passport-local-mongoose';


const adminSchema: PassportLocalSchema = new Schema({});
adminSchema.plugin(passportLocalMongoose);

export default model<PassportLocalDocument>('Admin', adminSchema);
