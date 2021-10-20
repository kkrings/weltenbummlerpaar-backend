import { ArrayUnique, IsInt, IsOptional, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindManyQueryParams {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @ArrayUnique()
  searchTags?: string[];

  @IsOptional()
  @IsInt()
  @IsPositive()
  skipDiaryEntries?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  numDiaryEntries?: number;
}
