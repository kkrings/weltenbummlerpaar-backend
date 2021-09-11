import { Test, TestingModule } from '@nestjs/testing';
import { nextTick } from 'process';
import { ObjectId } from 'mongodb';
import { DiaryEntriesController } from './diary-entries.controller';
import { DiaryEntriesService } from './diary-entries.service';
import { DiaryEntry } from './schemas/diary-entry.schema';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { DiaryEntryDto } from './dto/diary-entry.dto';
import { MongoIdParams } from 'src/dto/mongo-id-params.dto';
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto';

class DiaryEntriesServiceMock {
  diaryEntry: DiaryEntry = {
    _id: new ObjectId(),
    title: 'some title',
    location: 'some location',
    body: 'some body',
    searchTags: ['some tag'],
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  async create(createDiaryEntryDto: CreateDiaryEntryDto): Promise<DiaryEntry> {
    return {
      _id: this.diaryEntry._id,
      title: createDiaryEntryDto.title,
      location: createDiaryEntryDto.location,
      body: createDiaryEntryDto.body,
      searchTags: createDiaryEntryDto.searchTags,
      images: this.diaryEntry.images,
      createdAt: this.diaryEntry.createdAt,
      updatedAt: this.diaryEntry.updatedAt,
    };
  }

  async findMany(): Promise<DiaryEntry[]> {
    return [];
  }

  async findOne(diaryEntryId: string): Promise<DiaryEntry> {
    const diaryEntry = { ...this.diaryEntry };
    diaryEntry._id = ObjectId.createFromHexString(diaryEntryId);
    return diaryEntry;
  }

  async updateOne(
    diaryEntryId: string,
    updateDiaryEntryDto: UpdateDiaryEntryDto,
  ): Promise<DiaryEntry> {
    return {
      _id: ObjectId.createFromHexString(diaryEntryId),
      title: updateDiaryEntryDto.title ?? this.diaryEntry.title,
      location: updateDiaryEntryDto.location ?? this.diaryEntry.location,
      body: updateDiaryEntryDto.body ?? this.diaryEntry.body,
      searchTags: updateDiaryEntryDto.searchTags ?? this.diaryEntry.searchTags,
      images: [],
      createdAt: this.diaryEntry.createdAt,
      updatedAt: this.diaryEntry.updatedAt,
    };
  }

  async removeOne(diaryEntryId: string): Promise<DiaryEntry> {
    const diaryEntry = { ...this.diaryEntry };
    diaryEntry._id = ObjectId.createFromHexString(diaryEntryId);
    return diaryEntry;
  }
}

describe('DiaryEntriesController', () => {
  const mockService = new DiaryEntriesServiceMock();

  let controller: DiaryEntriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiaryEntriesController],
      providers: [
        {
          provide: DiaryEntriesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<DiaryEntriesController>(DiaryEntriesController);
  });

  describe('create', () => {
    const createSpy = jest.spyOn(mockService, 'create');

    const createDiaryEntryDto: CreateDiaryEntryDto = {
      title: 'some other title',
      location: 'some other location',
      body: 'some other body',
      searchTags: ['some other tag'],
    };

    let diaryEntryDto: DiaryEntryDto;

    beforeEach(async () => {
      diaryEntryDto = await controller.create(createDiaryEntryDto);
    });

    it('diary entry should have been returned', () => {
      const expectedDiaryEntryDto: DiaryEntryDto = {
        id: mockService.diaryEntry._id.toHexString(),
        title: createDiaryEntryDto.title,
        location: createDiaryEntryDto.location,
        body: createDiaryEntryDto.body,
        searchTags: createDiaryEntryDto.searchTags,
        images: [],
        createdAt: mockService.diaryEntry.createdAt,
        updatedAt: mockService.diaryEntry.updatedAt,
      };

      expect(diaryEntryDto).toEqual(expectedDiaryEntryDto);
    });

    it('DiaryEntriesService.create should have been called', () => {
      expect(createSpy).toHaveBeenCalledWith(createDiaryEntryDto);
    });
  });

  describe('findMany', () => {
    const findManySpy = jest.spyOn(mockService, 'findMany');

    beforeEach(async () => {
      await controller.findMany();
    });

    it('DiaryEntriesService.findMany should have been called', () => {
      expect(findManySpy).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const findOneQueryParams: MongoIdParams = {
      id: new ObjectId().toHexString(),
    };

    const findOneSpy = jest.spyOn(mockService, 'findOne');

    let diaryEntryDto: DiaryEntryDto;

    beforeEach(async () => {
      diaryEntryDto = await controller.findOne(findOneQueryParams);
    });

    it('diary entry should have been returned', () => {
      const expectedDiaryEntryDto: DiaryEntryDto = {
        id: findOneQueryParams.id,
        title: mockService.diaryEntry.title,
        location: mockService.diaryEntry.location,
        body: mockService.diaryEntry.body,
        searchTags: mockService.diaryEntry.searchTags,
        images: [],
        createdAt: mockService.diaryEntry.createdAt,
        updatedAt: mockService.diaryEntry.updatedAt,
      };

      expect(diaryEntryDto).toEqual(expectedDiaryEntryDto);
    });

    it('DiaryEntriesService.findOne should have been called', () => {
      expect(findOneSpy).toHaveBeenCalledWith(findOneQueryParams.id);
    });
  });

  describe('updateOne', () => {
    const updateOneSpy = jest.spyOn(mockService, 'updateOne');

    const updateOneQueryParams: MongoIdParams = {
      id: new ObjectId().toHexString(),
    };

    const updateDiaryEntryDto: UpdateDiaryEntryDto = {
      title: 'some other title',
    };

    let diaryEntryDto: DiaryEntryDto;

    beforeEach(async () => {
      diaryEntryDto = await controller.updateOne(
        updateOneQueryParams,
        updateDiaryEntryDto,
      );
    });

    it('diary entry should have been returned', () => {
      const expectedDiaryEntryDto: DiaryEntryDto = {
        id: updateOneQueryParams.id,
        title: updateDiaryEntryDto.title,
        location: mockService.diaryEntry.location,
        body: mockService.diaryEntry.body,
        searchTags: mockService.diaryEntry.searchTags,
        images: [],
        createdAt: mockService.diaryEntry.createdAt,
        updatedAt: mockService.diaryEntry.updatedAt,
      };

      expect(diaryEntryDto).toEqual(expectedDiaryEntryDto);
    });

    it('DiaryEntriesService.updateOne should have been called', () => {
      expect(updateOneSpy).toHaveBeenCalledWith(
        updateOneQueryParams.id,
        updateDiaryEntryDto,
      );
    });
  });

  describe('removeOne', () => {
    const removeOneSpy = jest.spyOn(mockService, 'removeOne');

    const removeOneQueryParams: MongoIdParams = {
      id: new ObjectId().toHexString(),
    };

    let diaryEntryDto: DiaryEntryDto;

    beforeEach(async () => {
      diaryEntryDto = await controller.removeOne(removeOneQueryParams);
    });

    it('diary entry should have been returned', () => {
      const expectedDiaryEntryDto: DiaryEntryDto = {
        id: removeOneQueryParams.id,
        title: mockService.diaryEntry.title,
        location: mockService.diaryEntry.location,
        body: mockService.diaryEntry.body,
        searchTags: mockService.diaryEntry.searchTags,
        images: [],
        createdAt: mockService.diaryEntry.createdAt,
        updatedAt: mockService.diaryEntry.updatedAt,
      };

      expect(diaryEntryDto).toEqual(expectedDiaryEntryDto);
    });

    it('DiaryEntriesService.removeOne should have been called', () => {
      expect(removeOneSpy).toHaveBeenCalledWith(removeOneQueryParams.id);
    });
  });

  afterAll(async () => {
    // jimp dependency: wait for import in node_modules/gifwrap/src/gifcodec.js
    const waitForNextTick = async (): Promise<unknown> =>
      await new Promise((resolve) => nextTick(resolve));

    await waitForNextTick();
  });
});
