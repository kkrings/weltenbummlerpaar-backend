import { IsOptional, IsString } from 'class-validator';

export class FindManyQueryParams {
  /**
   * Search for diary entry search tags that contain the specified string. The
   * search is case-insensitive.
   */
  @IsOptional()
  @IsString()
  searchTag?: string;
}
