import { Test, TestingModule } from '@nestjs/testing';
import { nextTick } from 'process';
import { Readable } from 'stream';
import { Express } from 'express';
import { ObjectId } from 'mongodb';
import { DiaryEntriesController } from './diary-entries.controller';
import { DiaryEntriesService } from './diary-entries.service';
import { DiaryEntry } from './schemas/diary-entry.schema';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { DiaryEntryDto } from './dto/diary-entry.dto';
import { MongoIdParams } from 'src/dto/mongo-id-params.dto';
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto';
import { CreateImageDto } from './images/dto/create-image.dto';
import { Image } from './images/schemas/image.schema';
import { ImageDto } from './images/dto/image.dto';
import { RemoveImageParams } from './dto/remove-image-params.dto';
import { FindManyQueryParams } from './dto/find-many-query-params.dto';

class DiaryEntriesServiceMock {
  diaryEntry: DiaryEntry;
  image: Image;

  constructor() {
    this.diaryEntry = {
      _id: new ObjectId(),
      title: 'some title',
      location: 'some location',
      body: 'some body',
      searchTags: ['some tag'],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.image = {
      _id: new ObjectId(),
      description: 'some description',
      diaryEntryId: this.diaryEntry._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

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
    return [this.diaryEntry];
  }

  async findOne(diaryEntryId: string): Promise<DiaryEntry> {
    const diaryEntry: DiaryEntry = { ...this.diaryEntry };
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
    const diaryEntry: DiaryEntry = { ...this.diaryEntry };
    diaryEntry._id = ObjectId.createFromHexString(diaryEntryId);
    return diaryEntry;
  }

  async addImage(
    diaryEntryId: string,
    createImageDto: CreateImageDto,
  ): Promise<DiaryEntry> {
    const diaryEntry: DiaryEntry = { ...this.diaryEntry };
    const image: Image = { ...this.image };
    diaryEntry._id = ObjectId.createFromHexString(diaryEntryId);
    image.description = createImageDto.description;
    image.diaryEntryId = diaryEntry._id;
    diaryEntry.images = [image];
    return diaryEntry;
  }

  async removeImage(
    diaryEntryId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    imageId: string,
  ): Promise<DiaryEntry> {
    const diaryEntry: DiaryEntry = { ...this.diaryEntry };
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

    describe('without query parameters', () => {
      let diaryEntries: DiaryEntryDto[];

      beforeEach(async () => {
        diaryEntries = await controller.findMany({});
      });

      it('diary entries should have been returned', () => {
        const diaryEntryDto: DiaryEntryDto = {
          id: mockService.diaryEntry._id.toHexString(),
          title: mockService.diaryEntry.title,
          location: mockService.diaryEntry.location,
          body: mockService.diaryEntry.body,
          searchTags: mockService.diaryEntry.searchTags,
          images: [],
          createdAt: mockService.diaryEntry.createdAt,
          updatedAt: mockService.diaryEntry.updatedAt,
        };

        expect(diaryEntries).toEqual([diaryEntryDto]);
      });

      it('DiaryEntriesService.findMany should have been called', () => {
        expect(findManySpy).toHaveBeenLastCalledWith({});
      });
    });

    describe('with search tags', () => {
      const queryParams: FindManyQueryParams = {
        searchTags: ['some tag'],
      };

      beforeEach(async () => {
        await controller.findMany(queryParams);
      });

      it('DiaryEntryService.findMany should have been called', () => {
        expect(findManySpy).toHaveBeenLastCalledWith(queryParams);
      });
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

  describe('addImage', () => {
    const addImageSpy = jest.spyOn(mockService, 'addImage');

    const addImageQueryParams: MongoIdParams = {
      id: new ObjectId().toHexString(),
    };

    const imageUpload: Express.Multer.File = {
      fieldname: '',
      originalname: '',
      encoding: '',
      mimetype: '',
      size: 0,
      stream: new Readable(),
      destination: '',
      filename: '',
      path: 'some path',
      buffer: Buffer.from([]),
    };

    const createImageDto: CreateImageDto = {
      description: 'some description',
      imageUpload: '',
    };

    let diaryEntryDto: DiaryEntryDto;

    beforeEach(async () => {
      const createImageDtoCopy: CreateImageDto = { ...createImageDto };

      diaryEntryDto = await controller.addImage(
        addImageQueryParams,
        imageUpload,
        createImageDtoCopy,
      );
    });

    it('diary should have been returned', () => {
      const expectedImageDto: ImageDto = {
        id: mockService.image._id.toHexString(),
        description: createImageDto.description,
        diaryEntryId: addImageQueryParams.id,
        createdAt: mockService.image.createdAt,
        updatedAt: mockService.image.updatedAt,
      };

      const expectedDiaryEntryDto: DiaryEntryDto = {
        id: addImageQueryParams.id,
        title: mockService.diaryEntry.title,
        location: mockService.diaryEntry.location,
        body: mockService.diaryEntry.body,
        searchTags: mockService.diaryEntry.searchTags,
        images: [expectedImageDto],
        createdAt: mockService.diaryEntry.createdAt,
        updatedAt: mockService.diaryEntry.updatedAt,
      };

      expect(diaryEntryDto).toEqual(expectedDiaryEntryDto);
    });

    it('DiaryEntries.addImage should have been called', () => {
      const createImageDtoCopy: CreateImageDto = { ...createImageDto };
      createImageDtoCopy.imageUpload = imageUpload.path;

      expect(addImageSpy).toHaveBeenCalledWith(
        addImageQueryParams.id,
        createImageDtoCopy,
      );
    });
  });

  describe('removeImage', () => {
    const removeImageSpy = jest.spyOn(mockService, 'removeImage');

    const removeImageQueryParams: RemoveImageParams = {
      diaryEntryId: new ObjectId().toHexString(),
      imageId: new ObjectId().toHexString(),
    };

    let diaryEntryDto: DiaryEntryDto;

    beforeEach(async () => {
      diaryEntryDto = await controller.removeImage(removeImageQueryParams);
    });

    it('diary entry should have been returned', () => {
      const expectedDiaryEntryDto: DiaryEntryDto = {
        id: removeImageQueryParams.diaryEntryId,
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

    it('DiaryEntriesService.removeImage should have been called', () => {
      expect(removeImageSpy).toHaveBeenCalledWith(
        removeImageQueryParams.diaryEntryId,
        removeImageQueryParams.imageId,
      );
    });
  });

  afterAll(async () => {
    // jimp dependency: wait for import in node_modules/gifwrap/src/gifcodec.js
    const waitForNextTick = async (): Promise<unknown> =>
      await new Promise((resolve) => nextTick(resolve));

    await waitForNextTick();
  });
});
