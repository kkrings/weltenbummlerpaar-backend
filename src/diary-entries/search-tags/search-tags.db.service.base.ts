import { DiaryEntry } from '../schemas/diary-entry.schema'
import { SearchTag } from './schemas/search-tag.schema'

export abstract class SearchTagsDBServiceBase {
  abstract findMany (): Promise<SearchTag[]>

  abstract removeOne (searchTag: string): Promise<SearchTag>

  abstract addDiaryEntryToOne (
    searchTag: string,
    diaryEntry: DiaryEntry,
  ): Promise<SearchTag>

  abstract removeDiaryEntryFromOne (
    searchTag: string,
    diaryEntry: DiaryEntry,
  ): Promise<SearchTag>
}
