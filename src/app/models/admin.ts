/**
 * User authentication model
 * @module models/admin
 */

import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

const adminSchema: mongoose.PassportLocalSchema = new mongoose.Schema({})
adminSchema.plugin(passportLocalMongoose)

export default mongoose.model<mongoose.PassportLocalDocument>('Admin', adminSchema)
