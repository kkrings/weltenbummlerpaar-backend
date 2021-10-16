import { PartialType } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';
import { CreateDiaryEntryDto } from './create-diary-entry.dto';

export class UpdateDiaryEntryDto extends PartialType(CreateDiaryEntryDto) {
  /**
   * Change the ordering of the diary entry's images.
   * @example ["60d468d1f33a8412d3cec16f", "60d468d1f33a8412d3cec16g"]
   */
  @IsOptional()
  @IsMongoId({ each: true })
  images?: string[];
}
