/**
 * Diary entry model
 * @module models/entry
 */

import { Document, model, Schema } from 'mongoose';

import { Image } from './image';
import { TimeStamps } from './timestamps';


/**
 * Diary entry model
 */
export interface DiaryEntry extends Document, TimeStamps {
  /**
   * Diary entry's title
   */
  title: string;
  /**
   * Diary entry's body
   */
  body: string;
  /**
   * Location the diary entry refers to, e.g.:
   * city, state, country
   */
  locationName: string;
  /**
   * Optional: list of images
   */
  images: Image['_id'][];
  /**
   * Optional: list of search tags
   */
  tags: string[];
}

const diaryEntrySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  locationName: {
    type: String,
    required: true,
  },
  images: [{
    type: Schema.Types.ObjectId,
    ref: 'Image',
  }],
  tags: {
    type: [String],
    index: true,
  },
}, {
  timestamps: true,
});

diaryEntrySchema.index({createdAt: -1});

export default model<DiaryEntry>('DiaryEntry', diaryEntrySchema);
