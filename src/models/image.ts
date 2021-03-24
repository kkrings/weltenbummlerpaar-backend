/**
 * Image model
 * @module models/image
 */

import { Document, model, Schema } from 'mongoose';

import { TimeStamps } from './timestamps';


/**
 * Image model
 */
export interface Image extends Document, TimeStamps {
  /**
   * Image's description: what is shown on the picture, where was it taken, ...
   */
  description: string;
}

const imageSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default model<Image>('Image', imageSchema);
