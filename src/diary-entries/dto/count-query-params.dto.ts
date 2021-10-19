import { ArrayUnique, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CountQueryParams {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @ArrayUnique()
  searchTags?: string[];
}
