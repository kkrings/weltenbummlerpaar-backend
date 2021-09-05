/**
 * Time stamps interface
 * @module models/timestamps
 */

/**
 * Time stamps
 *
 * If a Mongoose model's schema is declared with `timestamps` equal to true,
 * the model should extend this interface.
 */
export interface TimeStamps {
  /**
   * String representation of document's ID
   */
  id: string
  /**
   * Document's creation date and time
   */
  createdAt: Date
  /**
   * Date and time the document was last updated
   */
  updatedAt: Date
}
