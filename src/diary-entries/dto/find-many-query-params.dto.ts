import { ArrayUnique, IsInt, IsOptional, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindManyQueryParams {
  /**
   * Search for diary entries by their search tags. A diary entry is taken into
   * account if it has all of the specified search tags.
   */
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @ArrayUnique()
  searchTags?: string[];

  /**
   * Skip the specified number of diary entries.
   */
  @IsOptional()
  @IsInt()
  @IsPositive()
  skipDiaryEntries?: number;

  /**
   * Limit the number of diary entries to the specified number.
   */
  @IsOptional()
  @IsInt()
  @IsPositive()
  numDiaryEntries?: number;
}
