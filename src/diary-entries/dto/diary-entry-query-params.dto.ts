import { ArrayUnique, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class DiaryEntryQueryParams {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @ArrayUnique()
  searchTags?: string[];
}
