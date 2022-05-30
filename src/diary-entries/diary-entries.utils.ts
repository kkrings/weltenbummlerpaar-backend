import { asUnsetField } from '../app.utils';
import { UnsetFields } from '../dto/unset-fields';
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto';

export const getDiaryEntryUnsetFields = (
  updateDiaryEntryDto: UpdateDiaryEntryDto,
): UnsetFields<UpdateDiaryEntryDto> => ({
  dateRange: asUnsetField(updateDiaryEntryDto.dateRange),
  previewImage: asUnsetField(updateDiaryEntryDto.previewImage),
});
