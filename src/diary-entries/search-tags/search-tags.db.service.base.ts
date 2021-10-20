import { DiaryEntry } from '../schemas/diary-entry.schema';
import { FindManyQueryParams } from './dto/find-many-query-params.dto';
import { SearchTag } from './schemas/search-tag.schema';

export abstract class SearchTagsDBServiceBase {
  abstract findMany(params?: FindManyQueryParams): Promise<SearchTag[]>;

  abstract removeOne(searchTag: string): Promise<SearchTag>;

  abstract addDiaryEntryToOne(
    searchTag: string,
    diaryEntry: DiaryEntry,
  ): Promise<SearchTag>;

  abstract removeDiaryEntryFromOne(
    searchTag: string,
    diaryEntry: DiaryEntry,
  ): Promise<SearchTag>;
}
