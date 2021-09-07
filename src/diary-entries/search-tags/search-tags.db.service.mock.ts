import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { throwOnNull } from '../../schemas/base.schema';
import { DiaryEntry } from '../schemas/diary-entry.schema';
import { SearchTag } from './schemas/search-tag.schema';
import { SearchTagsDBServiceBase } from './search-tags.db.service.base';

@Injectable()
export class SearchTagsDBServiceMock extends SearchTagsDBServiceBase {
  constructor(
    @Inject('SearchTagsCollection')
    private readonly searchTagsCollection: SearchTag[],
  ) {
    super();
  }

  async findMany(): Promise<SearchTag[]> {
    return await Promise.resolve([...this.searchTagsCollection]);
  }

  async removeOne(searchTag: string): Promise<SearchTag> {
    return await throwOnNull(searchTag, async () => {
      const index = this.searchTagsCollection
        .map((entry) => entry.searchTag)
        .indexOf(searchTag);

      return await Promise.resolve(
        index === -1 ? null : this.searchTagsCollection.splice(index, 1)[0],
      );
    });
  }

  async addDiaryEntryToOne(
    searchTag: string,
    diaryEntry: DiaryEntry,
  ): Promise<SearchTag> {
    let foundSearchTag = this.searchTagsCollection
      .filter((entry) => entry.searchTag === searchTag)
      .shift();

    if (foundSearchTag === undefined) {
      foundSearchTag = {
        _id: new ObjectId(),
        searchTag: searchTag,
        diaryEntries: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.searchTagsCollection.push(foundSearchTag);
    }

    foundSearchTag.diaryEntries.push(diaryEntry._id);

    return await Promise.resolve(foundSearchTag);
  }

  async removeDiaryEntryFromOne(
    searchTag: string,
    diaryEntry: DiaryEntry,
  ): Promise<SearchTag> {
    return await throwOnNull(searchTag, async () => {
      const foundSearchTag = this.searchTagsCollection
        .filter((entry) => entry.searchTag === searchTag)
        .shift();

      if (foundSearchTag === undefined) {
        return await Promise.resolve(null);
      }

      foundSearchTag.diaryEntries = foundSearchTag.diaryEntries.filter(
        (id) => id !== diaryEntry._id,
      );

      return await Promise.resolve(foundSearchTag);
    });
  }
}
