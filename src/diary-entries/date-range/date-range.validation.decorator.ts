import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DiaryEntryDto } from '../dto/diary-entry.dto';
import { DateRange } from './schemas/date-range.schema';

@ValidatorConstraint()
export class IsDateRangeConstraint implements ValidatorConstraintInterface {
  validate(dateRange?: DateRange): boolean {
    return dateRange === undefined || dateRange.dateMin <= dateRange.dateMax;
  }

  defaultMessage({ property: dateRange }: ValidationArguments): string {
    return `${dateRange}.dateMin must be before or equals ${dateRange}.dateMax`;
  }
}

export function IsDateRange(): PropertyDecorator {
  return (diaryEntryDto: DiaryEntryDto, propertyName: string): void =>
    registerDecorator({
      target: diaryEntryDto.constructor,
      propertyName: propertyName,
      constraints: [],
      validator: IsDateRangeConstraint,
    });
}
