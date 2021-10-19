import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto';
import { DiaryEntry } from './schemas/diary-entry.schema';
import { Image } from './images/schemas/image.schema';
import { FindManyQueryParams } from './dto/find-many-query-params.dto';

export abstract class DiaryEntriesDBServiceBase {
  abstract create(
    createDiaryEntryDto: CreateDiaryEntryDto,
  ): Promise<DiaryEntry>;

  abstract findMany(params?: FindManyQueryParams): Promise<DiaryEntry[]>;
  abstract findOne(diaryEntryId: string): Promise<DiaryEntry>;

  abstract updateOne(
    diaryEntryId: string,
    updateDiaryEntryDto: UpdateDiaryEntryDto,
  ): Promise<DiaryEntry>;

  abstract removeOne(diaryEntryId: string): Promise<DiaryEntry>;

  abstract addImage(diaryEntryId: string, image: Image): Promise<DiaryEntry>;
  abstract removeImage(diaryEntryId: string, image: Image): Promise<DiaryEntry>;
}
