import { getSetFields } from './app.utils';
import { UpdateDiaryEntryDto } from './diary-entries/dto/update-diary-entry.dto';

describe('getSetFields', () => {
  let updateDiaryEntryDto: UpdateDiaryEntryDto;
  let setFields: Record<string, any>;

  beforeEach(() => {
    updateDiaryEntryDto = {
      title: 'some title',
      dateRange: null,
      previewImage: undefined,
    };
  });

  beforeEach(() => {
    setFields = getSetFields(updateDiaryEntryDto);
  });

  it('only #title should have been returned', () => {
    expect(setFields).toEqual({ title: updateDiaryEntryDto.title });
  });
});
