import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { throwOnNull } from '../schemas/base.schema';
import { DiaryEntriesDBServiceBase } from './diary-entries.db.service.base';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto';
import { DiaryEntry } from './schemas/diary-entry.schema';
import { Image } from './images/schemas/image.schema';
import { FindManyQueryParams } from './dto/find-many-query-params.dto';

@Injectable()
export class DiaryEntriesDBServiceMock extends DiaryEntriesDBServiceBase {
  constructor(
    @Inject('DiaryEntriesCollection')
    private readonly diaryEntriesCollection: DiaryEntry[],
  ) {
    super();
  }

  async create(createDiaryEntryDto: CreateDiaryEntryDto): Promise<DiaryEntry> {
    const diaryEntry: DiaryEntry = {
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [],
      ...createDiaryEntryDto,
    };

    this.diaryEntriesCollection.push(diaryEntry);

    return diaryEntry;
  }

  async findMany(params?: FindManyQueryParams): Promise<DiaryEntry[]> {
    const searchTags = params?.searchTags ?? [];

    return this.diaryEntriesCollection.filter((diaryEntry) =>
      searchTags.every((searchTag) =>
        diaryEntry.searchTags.includes(searchTag),
      ),
    );
  }

  async findOne(diaryEntryId: string): Promise<DiaryEntry> {
    return await throwOnNull(
      diaryEntryId,
      async () =>
        this.diaryEntriesCollection
          .filter((diaryEntry) => diaryEntry._id.equals(diaryEntryId))
          .shift() ?? null,
    );
  }

  async updateOne(
    diaryEntryId: string,
    updateDiaryEntryDto: UpdateDiaryEntryDto,
  ): Promise<DiaryEntry> {
    const diaryEntry = await this.findOne(diaryEntryId);

    const images = updateDiaryEntryDto.images?.map(
      (imageId) =>
        diaryEntry.images.filter((image) => image._id.equals(imageId))[0],
    );

    const updatedDiaryEntry: DiaryEntry = {
      _id: diaryEntry._id,
      title: updateDiaryEntryDto.title ?? diaryEntry.title,
      location: updateDiaryEntryDto.location ?? diaryEntry.location,
      body: updateDiaryEntryDto.body ?? diaryEntry.body,
      searchTags: updateDiaryEntryDto.searchTags ?? diaryEntry.searchTags,
      images: images ?? diaryEntry.images,
      createdAt: diaryEntry.createdAt,
      updatedAt: new Date(diaryEntry.createdAt.getTime() + 1000),
    };

    return Object.assign(diaryEntry, updatedDiaryEntry);
  }

  async removeOne(diaryEntryId: string): Promise<DiaryEntry> {
    return await throwOnNull(diaryEntryId, async () => {
      const index = this.diaryEntriesCollection
        .map((diaryEntry) => diaryEntry._id.toHexString())
        .indexOf(diaryEntryId);

      return index > -1
        ? this.diaryEntriesCollection.splice(index, 1)[0]
        : null;
    });
  }

  async addImage(diaryEntryId: string, image: Image): Promise<DiaryEntry> {
    const diaryEntry = await this.findOne(diaryEntryId);
    diaryEntry.images.push(image);
    return diaryEntry;
  }

  async removeImage(diaryEntryId, image: Image): Promise<DiaryEntry> {
    const diaryEntry = await this.findOne(diaryEntryId);

    diaryEntry.images = diaryEntry.images.filter(
      (otherImage) => !otherImage._id.equals(image._id),
    );

    return diaryEntry;
  }
}
