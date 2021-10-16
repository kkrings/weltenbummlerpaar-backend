import { ArrayUnique, IsArray, IsString } from 'class-validator';
import { asImageDto, ImageDto } from '../images/dto/image.dto';
import { DiaryEntry } from '../schemas/diary-entry.schema';

export class DiaryEntryDto {
  /**
   * Diary entry's unique identifier
   * @example '60bfd78704a7f25279cfa06a'
   */
  id: string;

  /**
   * Diary entry's title
   */
  @IsString()
  title: string;

  /**
   * Country, city, ..., the diary entry is about
   */
  @IsString()
  location: string;

  /**
   * Diary entry's content
   */
  @IsString()
  body: string;

  /**
   * Search tags the diary entry can be found with
   */
  @IsArray()
  @ArrayUnique()
  searchTags: string[];

  /**
   * Diary entry's images
   */
  images: ImageDto[];

  /**
   * Diary entry's creation date-time
   */
  createdAt: Date;

  /**
   * Date-time the diary entry was last modified
   */
  updatedAt: Date;
}

export function asDiaryEntryDto(diaryEntry: DiaryEntry): DiaryEntryDto {
  return {
    id: diaryEntry._id.toHexString(),
    title: diaryEntry.title,
    location: diaryEntry.location,
    body: diaryEntry.body,
    searchTags: diaryEntry.searchTags,
    images: diaryEntry.images.map((image) => asImageDto(image)),
    createdAt: diaryEntry.createdAt,
    updatedAt: diaryEntry.updatedAt,
  };
}
