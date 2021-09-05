/**
 * Diary entry model
 * @module models/entry
 */

import mongoose from 'mongoose'

import { Image } from './image'
import { TimeStamps } from './timestamps'

/**
 * Diary entry model
 */
export interface DiaryEntry extends TimeStamps {
  /**
   * Diary entry's title
   */
  title: string
  /**
   * Diary entry's body
   */
  body: string
  /**
   * Location the diary entry refers to, e.g.:
   * city, state, country
   */
  locationName: string
  /**
   * Optional: list of images
   */
  images: Image[]
  /**
   * Optional: list of search tags
   */
  tags: string[]
}

const diaryEntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  locationName: {
    type: String,
    required: true
  },
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  }],
  tags: {
    type: [String],
    index: true
  }
}, {
  timestamps: true
})

diaryEntrySchema.index({ createdAt: -1 })

export default mongoose.model<DiaryEntry>('DiaryEntry', diaryEntrySchema)
