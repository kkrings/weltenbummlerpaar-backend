import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { nextTick } from 'process';
import { DiaryEntriesDBService } from './diary-entries.db.service';
import { DiaryEntriesDBServiceMock } from './diary-entries.db.service.mock';
import { DiaryEntriesService } from './diary-entries.service';
import { CountQueryParams } from './dto/count-query-params.dto';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { FindManyQueryParams } from './dto/find-many-query-params.dto';
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto';
import { CreateImageDto } from './images/dto/create-image.dto';
import { ImageUploadService } from './images/image-upload/image-upload.service';
import { ImageUploadServiceMock } from './images/image-upload/image-upload.service.mock';
import { ImagesDBService } from './images/images.db.service';
import { ImagesDBServiceMock } from './images/images.db.service.mock';
import { ImagesService } from './images/images.service';
import { Image } from './images/schemas/image.schema';
import { DiaryEntry } from './schemas/diary-entry.schema';
import { SearchTag } from './search-tags/schemas/search-tag.schema';
import { SearchTagsDBService } from './search-tags/search-tags.db.service';
import { SearchTagsDBServiceMock } from './search-tags/search-tags.db.service.mock';
import { SearchTagsService } from './search-tags/search-tags.service';

describe('DiaryEntriesService', () => {
  let diaryEntriesCollection: DiaryEntry[];
  let searchTagsCollection: SearchTag[];
  let imagesCollection: Image[];

  let diaryEntriesService: DiaryEntriesService;
  let searchTagsService: SearchTagsService;
  let imagesService: ImagesService;

  beforeEach(() => {
    diaryEntriesCollection = [];
    searchTagsCollection = [];
    imagesCollection = [];
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'DiaryEntriesCollection',
          useValue: diaryEntriesCollection,
        },
        {
          provide: 'SearchTagsCollection',
          useValue: searchTagsCollection,
        },
        {
          provide: 'ImagesCollection',
          useValue: imagesCollection,
        },
        {
          provide: DiaryEntriesDBService,
          useClass: DiaryEntriesDBServiceMock,
        },
        {
          provide: SearchTagsDBService,
          useClass: SearchTagsDBServiceMock,
        },
        {
          provide: ImagesDBService,
          useClass: ImagesDBServiceMock,
        },
        {
          provide: ImageUploadService,
          useClass: ImageUploadServiceMock,
        },
        DiaryEntriesService,
        SearchTagsService,
        ImagesService,
      ],
    }).compile();

    diaryEntriesService = module.get<DiaryEntriesService>(DiaryEntriesService);
    searchTagsService = module.get<SearchTagsService>(SearchTagsService);
    imagesService = module.get<ImagesService>(ImagesService);
  });

  it('service should be defined', () => {
    expect(diaryEntriesService).toBeDefined();
  });

  describe('create', () => {
    let baseCreateDiaryEntryDto: CreateDiaryEntryDto;
    let diaryEntry: DiaryEntry;
    let diaryEntryInDB: DiaryEntry;
    let addDiaryEntryToManySpy: jest.SpyInstance;

    beforeEach(() => {
      baseCreateDiaryEntryDto = {
        title: 'some title',
        location: 'some location',
        body: 'some body',
        searchTags: ['some tag'],
      };
    });

    beforeEach(() => {
      addDiaryEntryToManySpy = jest.spyOn(
        searchTagsService,
        'addDiaryEntryToMany',
      );
    });

    describe('without date range', () => {
      let createDiaryEntryDto: CreateDiaryEntryDto;

      beforeEach(() => {
        createDiaryEntryDto = baseCreateDiaryEntryDto;
      });

      beforeEach(async () => {
        diaryEntry = await diaryEntriesService.create(createDiaryEntryDto);
      });

      beforeEach(() => {
        expect(diaryEntriesCollection.length).toEqual(1);
        diaryEntryInDB = diaryEntriesCollection[0];
      });

      it('diary entry should have been created', () => {
        const createdDiaryEntry: CreateDiaryEntryDto = {
          title: diaryEntryInDB.title,
          location: diaryEntryInDB.location,
          body: diaryEntryInDB.body,
          searchTags: diaryEntryInDB.searchTags,
        };

        expect(createdDiaryEntry).toEqual(createDiaryEntryDto);
      });
    });

    describe('with date range', () => {
      let createDiaryEntryDto: CreateDiaryEntryDto;

      beforeEach(() => {
        createDiaryEntryDto = {
          ...baseCreateDiaryEntryDto,
          dateRange: {
            dateMin: new Date(2020, 2, 14),
            dateMax: new Date(2020, 2, 14),
          },
        };
      });

      beforeEach(async () => {
        diaryEntry = await diaryEntriesService.create(createDiaryEntryDto);
      });

      beforeEach(() => {
        expect(diaryEntriesCollection.length).toEqual(1);
        diaryEntryInDB = diaryEntriesCollection[0];
      });

      it('diary entry should have been created', () => {
        const createdDiaryEntry: CreateDiaryEntryDto = {
          title: diaryEntryInDB.title,
          location: diaryEntryInDB.location,
          dateRange: diaryEntryInDB.dateRange,
          body: diaryEntryInDB.body,
          searchTags: diaryEntryInDB.searchTags,
        };

        expect(createdDiaryEntry).toEqual(createDiaryEntryDto);
      });
    });

    afterEach(() => {
      expect(diaryEntry).toEqual(diaryEntryInDB);
    });

    afterEach(() => {
      expect(addDiaryEntryToManySpy).toHaveBeenCalledWith(
        baseCreateDiaryEntryDto.searchTags,
        diaryEntry,
      );
    });
  });

  describe('findMany', () => {
    const diaryEntry: DiaryEntry = {
      _id: new ObjectId(),
      title: 'some title',
      location: 'some location',
      body: 'some body',
      searchTags: ['some tag'],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      diaryEntriesCollection.push(diaryEntry);
    });

    describe('without query parameters', () => {
      let diaryEntries: DiaryEntry[];

      beforeEach(async () => {
        diaryEntries = await diaryEntriesService.findMany();
      });

      it('diary entry should have been found', () => {
        expect(diaryEntries).toEqual([diaryEntry]);
      });
    });

    describe('without search tags', () => {
      let diaryEntries: DiaryEntry[];

      beforeEach(async () => {
        diaryEntries = await diaryEntriesService.findMany({});
      });

      it('diary entry should have been found', () => {
        expect(diaryEntries).toEqual([diaryEntry]);
      });
    });

    describe("with diary entry's search tags", () => {
      const queryParams: FindManyQueryParams = {
        searchTags: diaryEntry.searchTags,
      };

      let diaryEntries: DiaryEntry[];

      beforeEach(async () => {
        diaryEntries = await diaryEntriesService.findMany(queryParams);
      });

      it('diary entry should have been found', () => {
        expect(diaryEntries).toEqual([diaryEntry]);
      });
    });

    describe('with other search tags', () => {
      const queryParams: FindManyQueryParams = {
        searchTags: ['some other tag'],
      };

      let diaryEntries: DiaryEntry[];

      beforeEach(async () => {
        diaryEntries = await diaryEntriesService.findMany(queryParams);
      });

      it('no diary entry should have been found', () => {
        expect(diaryEntries).toEqual([]);
      });
    });

    describe('with skip diary entries', () => {
      const queryParams: FindManyQueryParams = {
        skipDiaryEntries: 2,
      };

      let diaryEntries: DiaryEntry[];

      beforeEach(async () => {
        diaryEntries = await diaryEntriesService.findMany(queryParams);
      });

      it('no diary entries should have been returned', () => {
        expect(diaryEntries).toHaveLength(0);
      });
    });

    describe('with limit diary entries', () => {
      const queryParams: FindManyQueryParams = {
        numDiaryEntries: 1,
      };

      let diaryEntries: DiaryEntry[];

      beforeEach(async () => {
        diaryEntries = await diaryEntriesService.findMany(queryParams);
      });

      it('diary entry should have been returned', () => {
        expect(diaryEntries).toHaveLength(1);
      });
    });
  });

  describe('count', () => {
    const diaryEntry: DiaryEntry = {
      _id: new ObjectId(),
      title: 'some title',
      location: 'some location',
      body: 'some body',
      searchTags: ['some tag'],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      diaryEntriesCollection.push(diaryEntry);
    });

    describe('without query parameters', () => {
      let numDiaryEntries: number;

      beforeEach(async () => {
        numDiaryEntries = await diaryEntriesService.count();
      });

      it('diary entry should have been counted', () => {
        expect(numDiaryEntries).toEqual(1);
      });
    });

    describe('without search tags', () => {
      let numDiaryEntries: number;

      beforeEach(async () => {
        numDiaryEntries = await diaryEntriesService.count({});
      });

      it('diary entry should have been counted', () => {
        expect(numDiaryEntries).toEqual(1);
      });
    });

    describe("with diary entry's search tags", () => {
      const queryParams: CountQueryParams = {
        searchTags: diaryEntry.searchTags,
      };

      let numDiaryEntries: number;

      beforeEach(async () => {
        numDiaryEntries = await diaryEntriesService.count(queryParams);
      });

      it('diary entry should have been counted', () => {
        expect(numDiaryEntries).toEqual(1);
      });
    });

    describe('with other search tags', () => {
      const queryParams: CountQueryParams = {
        searchTags: ['some other tag'],
      };

      let numDiaryEntries: number;

      beforeEach(async () => {
        numDiaryEntries = await diaryEntriesService.count(queryParams);
      });

      it('diary entry should not have been counted', () => {
        expect(numDiaryEntries).toEqual(0);
      });
    });
  });

  describe('findOne', () => {
    const diaryEntry: DiaryEntry = {
      _id: new ObjectId(),
      title: 'some title',
      location: 'some location',
      body: 'some body',
      searchTags: ['some tag'],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const diaryEntryId = diaryEntry._id.toHexString();

    describe('on diary entry in database', () => {
      beforeEach(() => {
        diaryEntriesCollection.push(diaryEntry);
      });

      it('diary entry should have been found', async () => {
        const foundDiaryEntry = await diaryEntriesService.findOne(diaryEntryId);
        expect(foundDiaryEntry).toEqual(diaryEntry);
      });
    });

    describe('on diary entry not in database', () => {
      const error = new NotFoundException(
        `Document with ID '${diaryEntryId}' could not be found.`,
      );

      it('not-found exception should have been thrown', async () => {
        const diaryEntryPromise = diaryEntriesService.findOne(diaryEntryId);
        await expect(diaryEntryPromise).rejects.toEqual(error);
      });
    });
  });

  describe('updateOne', () => {
    let diaryEntry: DiaryEntry;
    let searchTag: SearchTag;
    let images: Image[];

    beforeEach(() => {
      const createdAt = new Date();

      diaryEntry = {
        _id: new ObjectId(),
        title: 'some title',
        location: 'some location',
        body: 'some body',
        searchTags: ['some tag'],
        images: [],
        createdAt: createdAt,
        updatedAt: createdAt,
      };

      searchTag = {
        _id: new ObjectId(),
        searchTag: diaryEntry.searchTags[0],
        diaryEntries: [diaryEntry._id],
        createdAt: createdAt,
        updatedAt: createdAt,
      };

      images = [
        {
          _id: new ObjectId(),
          description: 'some description',
          diaryEntryId: diaryEntry._id,
          createdAt: createdAt,
          updatedAt: createdAt,
        },
        {
          _id: new ObjectId(),
          description: 'some other description',
          diaryEntryId: diaryEntry._id,
          createdAt: createdAt,
          updatedAt: createdAt,
        },
      ];
    });

    describe('without updated search tags or re-ordered images', () => {
      const updateDiaryEntryDto: UpdateDiaryEntryDto = {
        title: 'some other title',
        location: 'some other location',
        body: 'some other body',
      };

      let updatedDiaryEntry: DiaryEntry;
      let diaryEntryInDB: DiaryEntry;

      beforeEach(() => {
        diaryEntriesCollection.push({ ...diaryEntry });
        searchTagsCollection.push({ ...searchTag });
      });

      beforeEach(async () => {
        updatedDiaryEntry = await diaryEntriesService.updateOne(
          diaryEntry._id.toHexString(),
          updateDiaryEntryDto,
        );
      });

      beforeEach(() => {
        diaryEntryInDB = diaryEntriesCollection[0];
      });

      it('diary entry in database should have been returned', () => {
        expect(updatedDiaryEntry).toEqual(diaryEntryInDB);
      });

      it('diary entry in database should have been updated', () => {
        const expectedDiaryEntry = {
          _id: diaryEntry._id,
          title: updateDiaryEntryDto.title,
          location: updateDiaryEntryDto.location,
          body: updateDiaryEntryDto.body,
          searchTags: diaryEntry.searchTags,
          images: diaryEntry.images,
          createdAt: diaryEntry.createdAt,
          updatedAt: diaryEntryInDB.updatedAt,
        };

        expect(diaryEntryInDB).toEqual(expectedDiaryEntry);
      });

      it('updatedAt of diary entry in database should have been updated', () => {
        expect(diaryEntryInDB.updatedAt).not.toEqual(diaryEntry.updatedAt);
      });
    });

    describe('with updated search tags', () => {
      const updateDiaryEntryDto: UpdateDiaryEntryDto = {
        searchTags: ['some other tag'],
      };

      let updateManySpy: jest.SpyInstance;
      let updatedDiaryEntry: DiaryEntry;

      beforeEach(() => {
        updateManySpy = jest.spyOn(searchTagsService, 'updateMany');
      });

      beforeEach(() => {
        diaryEntriesCollection.push({ ...diaryEntry });
        searchTagsCollection.push({ ...searchTag });
      });

      beforeEach(async () => {
        updatedDiaryEntry = await diaryEntriesService.updateOne(
          diaryEntry._id.toHexString(),
          updateDiaryEntryDto,
        );
      });

      it('SearchTagsService.updateMany should have been called', () => {
        expect(updateManySpy).toHaveBeenCalledWith(
          updateDiaryEntryDto.searchTags,
          updatedDiaryEntry,
        );
      });
    });

    describe('with re-ordered images', () => {
      beforeEach(() => {
        diaryEntry.images.push(...images);
        diaryEntriesCollection.push({ ...diaryEntry });
        searchTagsCollection.push({ ...searchTag });
        imagesCollection.push(...images.map((image) => ({ ...image })));
      });

      describe('on valid re-ordered images', () => {
        beforeEach(async () => {
          const updateDiaryEntryDto: UpdateDiaryEntryDto = {
            images: [images[1]._id.toHexString(), images[0]._id.toHexString()],
          };

          await diaryEntriesService.updateOne(
            diaryEntry._id.toHexString(),
            updateDiaryEntryDto,
          );
        });

        it('diary entry in database should have been updated', () => {
          expect(diaryEntriesCollection[0].images).toEqual([
            images[1],
            images[0],
          ]);
        });
      });

      describe('on wrong number of images', () => {
        let diaryEntryPromise: Promise<DiaryEntry>;

        beforeEach(() => {
          const updateDiaryEntryDto: UpdateDiaryEntryDto = {
            images: [
              images[1]._id.toHexString(),
              images[0]._id.toHexString(),
              images[0]._id.toHexString(),
            ],
          };

          diaryEntryPromise = diaryEntriesService.updateOne(
            diaryEntry._id.toHexString(),
            updateDiaryEntryDto,
          );
        });

        it('not-found exception should have been thrown', async () => {
          const notFoundException = new NotFoundException(
            'Request body contains unknown image IDs.',
          );

          await expect(diaryEntryPromise).rejects.toEqual(notFoundException);
        });
      });

      describe('on unknown image IDs', () => {
        let diaryEntryPromise: Promise<DiaryEntry>;

        beforeEach(() => {
          const updatedDiaryEntry: UpdateDiaryEntryDto = {
            images: [
              new ObjectId().toHexString(),
              new ObjectId().toHexString(),
            ],
          };

          diaryEntryPromise = diaryEntriesService.updateOne(
            diaryEntry._id.toHexString(),
            updatedDiaryEntry,
          );
        });

        it('not-found exception should have been thrown', async () => {
          const notFoundException = new NotFoundException(
            'Request body contains unknown image IDs.',
          );

          await expect(diaryEntryPromise).rejects.toEqual(notFoundException);
        });
      });

      describe('on unknown preview image ID', () => {
        const previewImageId = new ObjectId().toHexString();
        let diaryEntryPromise: Promise<DiaryEntry>;

        beforeEach(() => {
          const updatedDiaryEntry: UpdateDiaryEntryDto = {
            previewImage: previewImageId,
          };

          diaryEntryPromise = diaryEntriesService.updateOne(
            diaryEntry._id.toHexString(),
            updatedDiaryEntry,
          );
        });

        it('not-found exception should have been thrown', async () => {
          const notFoundException = new NotFoundException(
            `Diary entry does not contain image with ID ${previewImageId}.`,
          );

          await expect(diaryEntryPromise).rejects.toEqual(notFoundException);
        });
      });

      describe('set preview image', () => {
        let updateDiaryEntryDto: UpdateDiaryEntryDto;
        let updatedDiaryEntry: DiaryEntry;
        let diaryEntryInDB: DiaryEntry;

        beforeEach(() => {
          updateDiaryEntryDto = {
            previewImage: images[0]._id.toHexString(),
          };
        });

        beforeEach(async () => {
          updatedDiaryEntry = await diaryEntriesService.updateOne(
            diaryEntry._id.toHexString(),
            updateDiaryEntryDto,
          );
        });

        beforeEach(() => {
          diaryEntryInDB = diaryEntriesCollection[0];
        });

        it('diary entry in database should have been returned', () => {
          expect(updatedDiaryEntry).toEqual(diaryEntryInDB);
        });

        it('diary entry in database should have been updated', () => {
          const expectedDiaryEntry = {
            _id: diaryEntry._id,
            title: diaryEntry.title,
            location: diaryEntry.location,
            body: diaryEntry.body,
            searchTags: diaryEntry.searchTags,
            images: diaryEntry.images,
            previewImage: diaryEntry.images[0],
            createdAt: diaryEntry.createdAt,
            updatedAt: diaryEntryInDB.updatedAt,
          };

          expect(diaryEntryInDB).toEqual(expectedDiaryEntry);
        });

        it('updatedAt of diary entry in database should have been updated', () => {
          expect(diaryEntryInDB.updatedAt).not.toEqual(diaryEntry.updatedAt);
        });
      });
    });

    describe('set date range', () => {
      const updateDiaryEntryDto: UpdateDiaryEntryDto = {
        dateRange: {
          dateMin: new Date(2020, 2, 14),
          dateMax: new Date(2020, 2, 14),
        },
      };

      let updatedDiaryEntry: DiaryEntry;
      let diaryEntryInDB: DiaryEntry;

      beforeEach(() => {
        diaryEntriesCollection.push({ ...diaryEntry });
        searchTagsCollection.push({ ...searchTag });
      });

      beforeEach(async () => {
        updatedDiaryEntry = await diaryEntriesService.updateOne(
          diaryEntry._id.toHexString(),
          updateDiaryEntryDto,
        );
      });

      beforeEach(() => {
        diaryEntryInDB = diaryEntriesCollection[0];
      });

      it('diary entry in database should have been returned', () => {
        expect(updatedDiaryEntry).toEqual(diaryEntryInDB);
      });

      it('diary entry in database should have been updated', () => {
        const expectedDiaryEntry = {
          _id: diaryEntry._id,
          title: diaryEntry.title,
          location: diaryEntry.location,
          dateRange: updateDiaryEntryDto.dateRange,
          body: diaryEntry.body,
          searchTags: diaryEntry.searchTags,
          images: diaryEntry.images,
          createdAt: diaryEntry.createdAt,
          updatedAt: diaryEntryInDB.updatedAt,
        };

        expect(diaryEntryInDB).toEqual(expectedDiaryEntry);
      });

      it('updatedAt of diary entry in database should have been updated', () => {
        expect(diaryEntryInDB.updatedAt).not.toEqual(diaryEntry.updatedAt);
      });
    });

    describe('unset date range', () => {
      const updateDiaryEntryDto: UpdateDiaryEntryDto = {
        dateRange: null,
      };

      let updatedDiaryEntry: DiaryEntry;
      let diaryEntryInDB: DiaryEntry;

      beforeEach(() => {
        diaryEntriesCollection.push({
          ...diaryEntry,
          dateRange: {
            dateMin: new Date(2020, 2, 14),
            dateMax: new Date(2020, 2, 14),
          },
        });
        searchTagsCollection.push({ ...searchTag });
      });

      beforeEach(async () => {
        updatedDiaryEntry = await diaryEntriesService.updateOne(
          diaryEntry._id.toHexString(),
          updateDiaryEntryDto,
        );
      });

      beforeEach(() => {
        diaryEntryInDB = diaryEntriesCollection[0];
      });

      it('diary entry in database should have been returned', () => {
        expect(updatedDiaryEntry).toEqual(diaryEntryInDB);
      });

      it('diary entry in database should have been updated', () => {
        const expectedDiaryEntry = {
          _id: diaryEntry._id,
          title: diaryEntry.title,
          location: diaryEntry.location,
          body: diaryEntry.body,
          searchTags: diaryEntry.searchTags,
          images: diaryEntry.images,
          createdAt: diaryEntry.createdAt,
          updatedAt: diaryEntryInDB.updatedAt,
        };

        expect(diaryEntryInDB).toEqual(expectedDiaryEntry);
      });

      it('updatedAt of diary entry in database should have been updated', () => {
        expect(diaryEntryInDB.updatedAt).not.toEqual(diaryEntry.updatedAt);
      });
    });
  });

  describe('removeOne', () => {
    const diaryEntry: DiaryEntry = {
      _id: new ObjectId(),
      title: 'some title',
      location: 'some location',
      body: 'some body',
      searchTags: [],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const searchTag: SearchTag = {
      _id: new ObjectId(),
      searchTag: 'some tag',
      diaryEntries: [diaryEntry._id],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    diaryEntry.searchTags.push(searchTag.searchTag);

    diaryEntry.images.push({
      _id: new ObjectId(),
      description: 'some description',
      diaryEntryId: diaryEntry._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const diaryEntryId = diaryEntry._id.toHexString();

    describe('on diary entry in database', () => {
      let removedDiaryEntry: DiaryEntry;
      let removeDiaryEntryFromManySpy: jest.SpyInstance;
      let removeManySpy: jest.SpyInstance;

      beforeEach(() => {
        diaryEntriesCollection.push(diaryEntry);
        searchTagsCollection.push(searchTag);
        imagesCollection.push(...diaryEntry.images);
      });

      beforeEach(() => {
        removeDiaryEntryFromManySpy = jest.spyOn(
          searchTagsService,
          'removeDiaryEntryFromMany',
        );
      });

      beforeEach(() => {
        removeManySpy = jest.spyOn(imagesService, 'removeMany');
      });

      beforeEach(async () => {
        removedDiaryEntry = await diaryEntriesService.removeOne(diaryEntryId);
      });

      it('diary entry in database should have been returned', () => {
        expect(removedDiaryEntry).toEqual(diaryEntry);
      });

      it('diary entry should have been removed from database', () => {
        expect(diaryEntriesCollection).toHaveLength(0);
      });

      it('SearchTagsService.removeDiaryEntryFromMany should have been called', () => {
        expect(removeDiaryEntryFromManySpy).toHaveBeenCalledWith(
          diaryEntry.searchTags,
          diaryEntry,
        );
      });

      it('ImagesService.removeMany should have been called', () => {
        expect(removeManySpy).toHaveBeenCalledWith(diaryEntry.images);
      });
    });

    describe('on diary entry not in database', () => {
      let diaryEntryPromise: Promise<DiaryEntry>;

      beforeEach(() => {
        diaryEntryPromise = diaryEntriesService.removeOne(diaryEntryId);
      });

      it('not-found exception should have been thrown', async () => {
        const error = new NotFoundException(
          `Document with ID '${diaryEntryId}' could not be found.`,
        );

        await expect(diaryEntryPromise).rejects.toEqual(error);
      });
    });
  });

  describe('addImage', () => {
    const diaryEntry: DiaryEntry = {
      _id: new ObjectId(),
      title: 'some title',
      location: 'some location',
      body: 'some body',
      searchTags: [],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createImageDto: CreateImageDto = {
      description: 'some description',
      imageUpload: '',
    };

    const diaryEntryId = diaryEntry._id.toHexString();

    describe('on diary entry in database', () => {
      let updatedDiaryEntry: DiaryEntry;

      beforeEach(() => {
        diaryEntriesCollection.push({
          _id: diaryEntry._id,
          title: diaryEntry.title,
          location: diaryEntry.location,
          body: diaryEntry.body,
          searchTags: [],
          images: [],
          createdAt: diaryEntry.createdAt,
          updatedAt: diaryEntry.updatedAt,
        });
      });

      beforeEach(async () => {
        updatedDiaryEntry = await diaryEntriesService.addImage(
          diaryEntryId,
          createImageDto,
        );
      });

      it('diary entry in database should have been returned', () => {
        expect(updatedDiaryEntry).toEqual(diaryEntriesCollection[0]);
      });

      it("diary entry's images should match the ones in the database", () => {
        expect(updatedDiaryEntry.images).toEqual(imagesCollection);
      });

      it('image should have been added to diary entry', () => {
        const images = updatedDiaryEntry.images.map((image) => ({
          description: image.description,
          diaryEntryId: image.diaryEntryId.toHexString(),
        }));

        const expectedImages = [
          {
            description: createImageDto.description,
            diaryEntryId: diaryEntryId,
          },
        ];

        expect(images).toEqual(expectedImages);
      });
    });

    describe('on diary entry not in database', () => {
      let diaryEntryPromise: Promise<DiaryEntry>;

      beforeEach(() => {
        diaryEntryPromise = diaryEntriesService.addImage(
          diaryEntryId,
          createImageDto,
        );
      });

      it('not-found exception should have been thrown', async () => {
        const error = new NotFoundException(
          `Document with ID '${diaryEntryId}' could not be found.`,
        );

        await expect(diaryEntryPromise).rejects.toEqual(error);
      });
    });
  });

  describe('removeImage', () => {
    const diaryEntry: DiaryEntry = {
      _id: new ObjectId(),
      title: 'some title',
      location: 'some location',
      body: 'some body',
      searchTags: [],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const image: Image = {
      _id: new ObjectId(),
      description: 'some description',
      diaryEntryId: diaryEntry._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    diaryEntry.images.push(image);

    const diaryEntryId = diaryEntry._id.toHexString();
    const imageId = image._id.toHexString();

    describe('on diary entry in database', () => {
      describe('on image in database', () => {
        let updatedDiaryEntry: DiaryEntry;

        beforeEach(() => {
          const diaryEntryCopy = { ...diaryEntry };
          diaryEntryCopy.images = [...diaryEntry.images];
          diaryEntriesCollection.push(diaryEntryCopy);
        });

        beforeEach(() => {
          imagesCollection.push({ ...image });
        });

        beforeEach(async () => {
          updatedDiaryEntry = await diaryEntriesService.removeImage(
            diaryEntryId,
            imageId,
          );
        });

        it('diary entry in database should have been returned', () => {
          expect(updatedDiaryEntry).toEqual(diaryEntriesCollection[0]);
        });

        it('image should have been removed from diary entry', () => {
          expect(updatedDiaryEntry.images).toHaveLength(0);
        });

        it('image should have been removed from database', () => {
          expect(imagesCollection).toHaveLength(0);
        });
      });

      describe('on image not in database', () => {
        let diaryEntryPromise: Promise<DiaryEntry>;

        beforeEach(() => {
          const diaryEntryCopy = { ...diaryEntry };
          diaryEntryCopy.images = [];
          diaryEntriesCollection.push(diaryEntryCopy);
        });

        beforeEach(() => {
          diaryEntryPromise = diaryEntriesService.removeImage(
            diaryEntryId,
            imageId,
          );
        });

        it('not-found exception should have been thrown', async () => {
          const error = new NotFoundException(
            `Diary entry does not contain image with ID ${imageId}.`,
          );

          await expect(diaryEntryPromise).rejects.toEqual(error);
        });
      });
    });

    describe('on diary entry not in database', () => {
      let diaryEntryPromise: Promise<DiaryEntry>;

      beforeEach(() => {
        diaryEntryPromise = diaryEntriesService.removeImage(
          diaryEntryId,
          imageId,
        );
      });

      it('not-found exception should have been thrown', async () => {
        const error = new NotFoundException(
          `Document with ID '${diaryEntryId}' could not be found.`,
        );

        await expect(diaryEntryPromise).rejects.toEqual(error);
      });
    });

    describe('unsetPreviewImage', () => {
      const diaryEntry: DiaryEntry = {
        _id: new ObjectId(),
        title: 'some title',
        location: 'some location',
        body: 'some body',
        searchTags: [],
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const image: Image = {
        _id: new ObjectId(),
        description: 'some description',
        diaryEntryId: diaryEntry._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const otherImage: Image = {
        _id: new ObjectId(),
        description: 'some description',
        diaryEntryId: diaryEntry._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      diaryEntry.images.push(image, otherImage);
      diaryEntry.previewImage = image;

      const diaryEntryId = diaryEntry._id.toHexString();

      beforeEach(() => {
        diaryEntriesCollection.push({
          ...diaryEntry,
          images: [...diaryEntry.images],
        });
      });

      beforeEach(() => {
        imagesCollection.push(image, otherImage);
      });

      describe('remove preview image', () => {
        let updatedDiaryEntry: DiaryEntry;

        beforeEach(async () => {
          updatedDiaryEntry = await diaryEntriesService.removeImage(
            diaryEntryId,
            image._id.toHexString(),
          );
        });

        it('preview image should have been unset', () => {
          expect(updatedDiaryEntry.previewImage).toBeUndefined();
        });
      });

      describe('remove other image', () => {
        let updatedDiaryEntry: DiaryEntry;

        beforeEach(async () => {
          updatedDiaryEntry = await diaryEntriesService.removeImage(
            diaryEntryId,
            otherImage._id.toHexString(),
          );
        });

        it('preview image should not have been unset', () => {
          expect(updatedDiaryEntry.previewImage).toBe(image);
        });
      });
    });
  });

  afterAll(async () => {
    // jimp dependency: wait for import in node_modules/gifwrap/src/gifcodec.js
    const waitForNextTick = async (): Promise<unknown> =>
      await new Promise((resolve) => nextTick(resolve));

    await waitForNextTick();
  });
});
