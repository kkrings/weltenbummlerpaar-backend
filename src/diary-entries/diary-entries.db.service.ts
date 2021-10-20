import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { throwOnNull } from '../schemas/base.schema';
import { DiaryEntriesDBServiceBase } from './diary-entries.db.service.base';
import { CountQueryParams } from './dto/count-query-params.dto';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { FindManyQueryParams } from './dto/find-many-query-params.dto';
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto';
import { Image } from './images/schemas/image.schema';
import { DiaryEntry, DiaryEntryDocument } from './schemas/diary-entry.schema';

@Injectable()
export class DiaryEntriesDBService extends DiaryEntriesDBServiceBase {
  constructor(
    @InjectModel(DiaryEntry.name)
    private readonly diaryEntryModel: Model<DiaryEntryDocument>,
  ) {
    super();
  }

  async create(createDiaryEntryDto: CreateDiaryEntryDto): Promise<DiaryEntry> {
    return await this.diaryEntryModel.create(createDiaryEntryDto);
  }

  async findMany(params?: FindManyQueryParams): Promise<DiaryEntry[]> {
    const { searchTags, skipDiaryEntries, numDiaryEntries } = params;

    let query = this.diaryEntryModel
      .find(searchTags ? { searchTags: { $all: searchTags } } : {})
      .sort({ createdAt: -1 });

    if (skipDiaryEntries) {
      query = query.skip(skipDiaryEntries);
    }

    if (numDiaryEntries) {
      query = query.limit(numDiaryEntries);
    }

    return query.populate('images').exec();
  }

  async count(params?: CountQueryParams): Promise<number> {
    const query = params?.searchTags
      ? this.diaryEntryModel.countDocuments({
          searchTags: { $all: params.searchTags },
        })
      : this.diaryEntryModel.estimatedDocumentCount();

    return await query.exec();
  }

  async findOne(diaryEntryId: string): Promise<DiaryEntry> {
    return await throwOnNull(
      diaryEntryId,
      async () =>
        await this.diaryEntryModel
          .findById(diaryEntryId)
          .populate('images')
          .exec(),
    );
  }

  async updateOne(
    diaryEntryId: string,
    updateDiaryEntryDto: UpdateDiaryEntryDto,
  ): Promise<DiaryEntry> {
    return await throwOnNull(
      diaryEntryId,
      async () =>
        await this.diaryEntryModel
          .findByIdAndUpdate(
            diaryEntryId,
            { $set: updateDiaryEntryDto as any },
            { new: true },
          )
          .populate('images')
          .exec(),
    );
  }

  async removeOne(diaryEntryId: string): Promise<DiaryEntry> {
    return await throwOnNull(
      diaryEntryId,
      async () =>
        await this.diaryEntryModel
          .findByIdAndRemove(diaryEntryId)
          .populate('images')
          .exec(),
    );
  }

  async addImage(diaryEntryId: string, image: Image): Promise<DiaryEntry> {
    return await throwOnNull(
      diaryEntryId,
      async () =>
        await this.diaryEntryModel
          .findByIdAndUpdate(
            diaryEntryId,
            { $push: { images: image._id } },
            { new: true },
          )
          .populate('images')
          .exec(),
    );
  }

  async removeImage(diaryEntryId: string, image: Image): Promise<DiaryEntry> {
    return await throwOnNull(
      diaryEntryId,
      async () =>
        await this.diaryEntryModel
          .findByIdAndUpdate(
            diaryEntryId,
            { $pull: { images: image._id } },
            { new: true },
          )
          .populate('images')
          .exec(),
    );
  }
}
