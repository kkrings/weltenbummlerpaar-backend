/**
 * Image model
 * @module models/image
 */

import mongoose from 'mongoose'

import { TimeStamps } from './timestamps'

/**
 * Image model
 */
export interface Image extends mongoose.Document, TimeStamps {
  /**
   * Image's description: what is shown on the picture, where was it taken, ...
   */
  description: string
}

const imageSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

export default mongoose.model<Image>('Image', imageSchema)
