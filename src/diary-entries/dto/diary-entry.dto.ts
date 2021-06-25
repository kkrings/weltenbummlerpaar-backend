import { ArrayUnique, IsMongoId } from 'class-validator'

export class DiaryEntryDto {
  /**
   * Diary entry's unique identifier
   * @example '60bfd78704a7f25279cfa06a'
   */
  @IsMongoId()
  id: string

  /**
   * Diary entry's title
   */
  title: string

  /**
   * Country, city, ..., the diary entry is about
   */
  location: string

  /**
   * Diary entry's content
   */
  body: string

  /**
   * Search tags the diary entry can be found with
   */
  @ArrayUnique()
  searchTags: string[]

  /**
   * Diary entry's creation date-time
   */
  createdAt: Date

  /**
   * Date-time the diary entry was last modified
   */
  updatedAt: Date
}
