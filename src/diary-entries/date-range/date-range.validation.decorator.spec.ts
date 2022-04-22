import { validate, ValidationError } from 'class-validator';
import { ObjectId } from 'mongodb';
import { DiaryEntryDto } from '../dto/diary-entry.dto';

describe('IsDateRange', () => {
  const createDiaryEntryDto = () => {
    const diaryEntryDto = new DiaryEntryDto();

    diaryEntryDto.id = new ObjectId().toHexString();
    diaryEntryDto.title = 'some title';
    diaryEntryDto.location = 'some location';
    diaryEntryDto.body = 'some body';
    diaryEntryDto.searchTags = ['some search tag'];
    diaryEntryDto.images = [];
    diaryEntryDto.createdAt = new Date();
    diaryEntryDto.updatedAt = new Date();

    return diaryEntryDto;
  };

  describe('#dateRange is undefined', () => {
    let diaryEntryDto: DiaryEntryDto;
    let validationErrors: ValidationError[];

    beforeEach(() => {
      diaryEntryDto = createDiaryEntryDto();
    });

    beforeEach(async () => {
      validationErrors = await validate(diaryEntryDto);
    });

    it('validation should not have been applied', () => {
      expect(validationErrors.length).toEqual(0);
    });
  });

  describe('#dateRange is valid: #dateMin equals #dateMax', () => {
    let diaryEntryDto: DiaryEntryDto;
    let validationErrors: ValidationError[];

    beforeEach(() => {
      diaryEntryDto = createDiaryEntryDto();

      diaryEntryDto.dateRange = {
        dateMin: new Date('2020-02-14'),
        dateMax: new Date('2020-02-14'),
      };
    });

    beforeEach(async () => {
      validationErrors = await validate(diaryEntryDto);
    });

    it('validation should have been passed', () => {
      expect(validationErrors.length).toEqual(0);
    });
  });

  describe('#dateRange is valid: #dateMin is before #dateMax', () => {
    let diaryEntryDto: DiaryEntryDto;
    let validationErrors: ValidationError[];

    beforeEach(() => {
      diaryEntryDto = createDiaryEntryDto();

      diaryEntryDto.dateRange = {
        dateMin: new Date('2020-02-14'),
        dateMax: new Date('2020-02-15'),
      };
    });

    beforeEach(async () => {
      validationErrors = await validate(diaryEntryDto);
    });

    it('validation should have been passed', () => {
      expect(validationErrors.length).toEqual(0);
    });
  });

  describe('#dateRange is invalid: #dateMin is after #dateMax', () => {
    let diaryEntryDto: DiaryEntryDto;
    let validationErrors: ValidationError[];

    beforeEach(() => {
      diaryEntryDto = createDiaryEntryDto();

      diaryEntryDto.dateRange = {
        dateMin: new Date('2020-02-15'),
        dateMax: new Date('2020-02-14'),
      };
    });

    beforeEach(async () => {
      validationErrors = await validate(diaryEntryDto);
    });

    it('validation should have been failed', () => {
      expect(validationErrors.length).toBeGreaterThan(0);
    });
  });
});
