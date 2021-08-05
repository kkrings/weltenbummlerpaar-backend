import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ObjectId } from 'mongodb'
import { nextTick } from 'process'
import { DiaryEntriesDBService } from './diary-entries.db.service'
import { DiaryEntriesDBServiceMock } from './diary-entries.db.service.mock'
import { DiaryEntriesService } from './diary-entries.service'
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto'
import { ImageUploadService } from './images/image-upload/image-upload.service'
import { ImageUploadServiceMock } from './images/image-upload/image-upload.service.mock'
import { ImagesDBService } from './images/images.db.service'
import { ImagesDBServiceMock } from './images/images.db.service.mock'
import { ImagesService } from './images/images.service'
import { Image } from './images/schemas/image.schema'
import { DiaryEntry } from './schemas/diary-entry.schema'
import { SearchTag } from './search-tags/schemas/search-tag.schema'
import { SearchTagsDBService } from './search-tags/search-tags.db.service'
import { SearchTagsDBServiceMock } from './search-tags/search-tags.db.service.mock'
import { SearchTagsService } from './search-tags/search-tags.service'

describe('DiaryEntriesService', () => {
  let diaryEntriesCollection: DiaryEntry[]
  let searchTagsCollection: SearchTag[]
  let imagesCollection: Image[]

  let diaryEntriesService: DiaryEntriesService
  let searchTagsService: SearchTagsService

  beforeEach(() => {
    diaryEntriesCollection = []
    searchTagsCollection = []
    imagesCollection = []
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'DiaryEntriesCollection',
          useValue: diaryEntriesCollection
        },
        {
          provide: 'SearchTagsCollection',
          useValue: searchTagsCollection
        },
        {
          provide: 'ImagesCollection',
          useValue: imagesCollection
        },
        {
          provide: DiaryEntriesDBService,
          useClass: DiaryEntriesDBServiceMock
        },
        {
          provide: SearchTagsDBService,
          useClass: SearchTagsDBServiceMock
        },
        {
          provide: ImagesDBService,
          useClass: ImagesDBServiceMock
        },
        {
          provide: ImageUploadService,
          useClass: ImageUploadServiceMock
        },
        DiaryEntriesService,
        SearchTagsService,
        ImagesService
      ]
    }).compile()

    diaryEntriesService = module.get<DiaryEntriesService>(DiaryEntriesService)
    searchTagsService = module.get<SearchTagsService>(SearchTagsService)
  })

  it('service should be defined', () => {
    expect(diaryEntriesService).toBeDefined()
  })

  describe('create', () => {
    const createDiaryEntryDto: CreateDiaryEntryDto = {
      title: 'some title',
      location: 'some location',
      body: 'some body',
      searchTags: ['some tag']
    }

    let diaryEntry: DiaryEntry
    let diaryEntryInDB: DiaryEntry

    let addDiaryEntryToManySpy: jest.SpyInstance

    beforeEach(() => {
      addDiaryEntryToManySpy = jest.spyOn(searchTagsService, 'addDiaryEntryToMany')
    })

    beforeEach(async () => {
      diaryEntry = await diaryEntriesService.create(createDiaryEntryDto)
    })

    beforeEach(() => {
      expect(diaryEntriesCollection.length).toEqual(1)
      diaryEntryInDB = diaryEntriesCollection[0]
    })

    it('diary entry should have been created', () => {
      const createdDiaryEntry: CreateDiaryEntryDto = {
        title: diaryEntryInDB.title,
        location: diaryEntryInDB.location,
        body: diaryEntryInDB.body,
        searchTags: diaryEntryInDB.searchTags
      }

      expect(createdDiaryEntry).toEqual(createDiaryEntryDto)
    })

    it('diary entry in database should have been returned', () => {
      expect(diaryEntry).toEqual(diaryEntryInDB)
    })

    it('addDiaryEntryToMany should have been called', () => {
      expect(addDiaryEntryToManySpy).toHaveBeenCalledWith(
        createDiaryEntryDto.searchTags,
        diaryEntry
      )
    })
  })

  describe('findMany', () => {
    const diaryEntry: DiaryEntry = {
      _id: new ObjectId(),
      title: 'some title',
      location: 'some location',
      body: 'some body',
      searchTags: ['some tag'],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    beforeEach(() => {
      diaryEntriesCollection.push(diaryEntry)
    })

    it('diary entry should have been found', async () => {
      const diaryEntries = await diaryEntriesService.findMany()
      expect(diaryEntries).toEqual([diaryEntry])
    })
  })

  describe('findOne', () => {
    const diaryEntry: DiaryEntry = {
      _id: new ObjectId(),
      title: 'some title',
      location: 'some location',
      body: 'some body',
      searchTags: ['some tag'],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const diaryEntryId = diaryEntry._id.toHexString()

    describe('on diary entry in database', () => {
      beforeEach(() => {
        diaryEntriesCollection.push(diaryEntry)
      })

      it('diary entry should have been found', async () => {
        const foundDiaryEntry = await diaryEntriesService.findOne(diaryEntryId)
        expect(foundDiaryEntry).toEqual(diaryEntry)
      })
    })

    describe('on diary entry not in database', () => {
      const error = new NotFoundException(
        `Document with ID '${diaryEntryId}' could not be found.`
      )

      it('not-found exception should have been thrown', async () => {
        const diaryEntryPromise = diaryEntriesService.findOne(diaryEntryId)
        await expect(diaryEntryPromise).rejects.toEqual(error)
      })
    })
  })

  afterAll(async () => {
    // jimp dependency: wait for import in node_modules/gifwrap/src/gifcodec.js
    const waitForNextTick = async (): Promise<unknown> => await new Promise(
      resolve => nextTick(resolve)
    )

    await waitForNextTick()
  })
})
