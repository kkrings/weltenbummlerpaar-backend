import { ArrayUnique, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CountQueryParams {
  /**
   * Count only the diary entries that have all of the specified search tags.
   */
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @ArrayUnique()
  searchTags?: string[];
}
