import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DiaryEntryDto } from '../dto/diary-entry.dto';
import { DateRangeDto } from './dto/date-range.dto';

@ValidatorConstraint()
export class IsDateRangeConstraint implements ValidatorConstraintInterface {
  validate(dateRangeDto?: DateRangeDto | null): boolean {
    return dateRangeDto == null || dateRangeDto.dateMin <= dateRangeDto.dateMax;
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
