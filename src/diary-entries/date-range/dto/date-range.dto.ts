import { IsDate } from 'class-validator';

export class DateRangeDto {
  /**
   * Time period's start date
   */
  @IsDate()
  dateMin: Date;

  /**
   * Time period's end date
   */
  @IsDate()
  dateMax: Date;
}
