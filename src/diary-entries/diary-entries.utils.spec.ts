import { ObjectId } from 'mongodb';
import { getDiaryEntryUnsetFields } from './diary-entries.utils';

describe('getDiaryEntryUnsetFields', () => {
  it('empty object should have been returned', () => {
    expect(getDiaryEntryUnsetFields({ title: 'some title' })).toEqual({});
  });

  it('#dateRange field should have been set to null', () => {
    expect(getDiaryEntryUnsetFields({ dateRange: null })).toEqual({
      dateRange: null,
    });
  });

  it('#dateRange field should have been set to undefined', () => {
    expect(
      getDiaryEntryUnsetFields({
        dateRange: {
          dateMin: new Date(2020, 2, 14),
          dateMax: new Date(2020, 2, 14),
        },
      }),
    ).toEqual({
      dateRange: undefined,
    });
  });

  it('#previewImage field should have been set to null', () => {
    expect(getDiaryEntryUnsetFields({ previewImage: null })).toEqual({
      previewImage: null,
    });
  });

  it('#previewImage field should have been set to undefined', () => {
    expect(
      getDiaryEntryUnsetFields({
        previewImage: new ObjectId().toHexString(),
      }),
    ).toEqual({
      previewImage: undefined,
    });
  });
});
