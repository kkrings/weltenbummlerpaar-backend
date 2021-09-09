import { Test, TestingModule } from '@nestjs/testing';
import { nextTick } from 'process';
import { ObjectId } from 'mongodb';
import { DiaryEntriesController } from './diary-entries.controller';
import { DiaryEntriesService } from './diary-entries.service';
import { DiaryEntry } from './schemas/diary-entry.schema';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { DiaryEntryDto } from './dto/diary-entry.dto';

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

  afterAll(async () => {
    // jimp dependency: wait for import in node_modules/gifwrap/src/gifcodec.js
    const waitForNextTick = async (): Promise<unknown> =>
      await new Promise((resolve) => nextTick(resolve));

    await waitForNextTick();
  });
});
