import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ObjectId } from 'mongodb'
import { DiaryEntry } from '../schemas/diary-entry.schema'
import { SearchTag } from './schemas/search-tag.schema'
import { SearchTagsDBService } from './search-tags-db.service'
import { SearchTagsDBServiceMock } from './search-tags-db.service.mock'
import { SearchTagsService } from './search-tags.service'

describe('SearchTagsService', () => {
  let searchTagsCollection: SearchTag[] = []

  let service: SearchTagsService

  beforeEach(() => {
    searchTagsCollection = []
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'SearchTagsCollection',
          useValue: searchTagsCollection

        },
        {
          provide: SearchTagsDBService,
          useClass: SearchTagsDBServiceMock
        },
        SearchTagsService
      ]
    }).compile()

    service = module.get<SearchTagsService>(SearchTagsService)
  })

  describe('findMany', () => {
    const searchTags: SearchTag[] = [
      {
        _id: new ObjectId(),
        searchTag: 'some search tag',
        diaryEntries: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    beforeEach(() => {
      searchTagsCollection.push(...searchTags)
    })

    it('should find search tags', async () => {
      expect(await service.findMany()).toEqual(
        searchTags.map(searchTag => searchTag.searchTag)
      )
    })
  })

  describe('addDiaryEntryToMany', () => {
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

    let searchTags: SearchTag[]

    beforeEach(async () => {
      searchTags = await service.addDiaryEntryToMany(diaryEntry.searchTags, diaryEntry)
    })

    it('should return search tags', () => {
      expect(searchTags.map(searchTag => searchTag.searchTag)).toEqual(
        diaryEntry.searchTags
      )
    })

    it('diary entry should have been added to returned search tags', () => {
      const areAdded = searchTags.map(
        searchTag => searchTag.diaryEntries.includes(diaryEntry._id)
      )

      expect(areAdded).toEqual(searchTags.map(_ => true))
    })

    it('should store search tags', () => {
      expect(searchTagsCollection).toEqual(searchTags)
    })
  })

  describe('addDiaryEntryToMany', () => {
    const searchTagValue = 'some tag'

    const searchTag: SearchTag = {
      _id: new ObjectId(),
      searchTag: searchTagValue,
      diaryEntries: [new ObjectId()],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const diaryEntry: DiaryEntry = {
      _id: new ObjectId(),
      title: 'some title',
      location: 'some location',
      body: 'some body',
      searchTags: [searchTagValue],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    beforeEach(() => {
      searchTagsCollection.push(searchTag)
    })

    beforeEach(async () => {
      await service.addDiaryEntryToMany(diaryEntry.searchTags, diaryEntry)
    })

    it('diary entry should have been added to existing search tag', () => {
      expect(searchTag.diaryEntries).toContain(diaryEntry._id)
    })
  })

  describe('removeDiaryEntryFromMany', () => {
    const searchTagValue = 'some tag'

    const diaryEntry: DiaryEntry = {
      _id: new ObjectId(),
      title: 'some title',
      location: 'some location',
      body: 'some body',
      searchTags: [searchTagValue],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const searchTag: SearchTag = {
      _id: new ObjectId(),
      searchTag: searchTagValue,
      diaryEntries: [new ObjectId(), diaryEntry._id],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    let searchTags: SearchTag[]

    beforeEach(() => {
      searchTagsCollection.push(searchTag)
    })

    beforeEach(async () => {
      searchTags = await service.removeDiaryEntryFromMany(
        diaryEntry.searchTags,
        diaryEntry
      )
    })

    it('should return search tags', () => {
      expect(searchTags.map(searchTag => searchTag.searchTag)).toEqual(
        diaryEntry.searchTags
      )
    })

    it('diary entry should have been removed from returned search tags', () => {
      const areRemoved = searchTags.map(
        searchTag => searchTag.diaryEntries.includes(diaryEntry._id))

      expect(areRemoved).toEqual(searchTags.map(_ => false))
    })

    it('diary entry should have been removed from stored search tag', () => {
      expect(searchTag.diaryEntries).not.toContain(diaryEntry._id)
    })
  })

  describe('removeDiaryEntryFromMany', () => {
    const searchTagValue = 'some tag'

    const diaryEntry: DiaryEntry = {
      _id: new ObjectId(),
      title: 'some title',
      location: 'some location',
      body: 'some body',
      searchTags: [searchTagValue],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const searchTag: SearchTag = {
      _id: new ObjectId(),
      searchTag: searchTagValue,
      diaryEntries: [diaryEntry._id],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    beforeEach(() => {
      searchTagsCollection.push(searchTag)
    })

    beforeEach(async () => {
      await service.removeDiaryEntryFromMany(
        diaryEntry.searchTags,
        diaryEntry
      )
    })

    it('should remove search tag', () => {
      expect(searchTagsCollection.length).toEqual(0)
    })
  })

  describe('removeDiaryEntryFromMany', () => {
    const searchTagValue = 'some tag'

    const diaryEntry: DiaryEntry = {
      _id: new ObjectId(),
      title: 'some title',
      location: 'some location',
      body: 'some body',
      searchTags: [searchTagValue],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    it('should throw not-found exception', async () => {
      const promise = service.removeDiaryEntryFromMany(
        diaryEntry.searchTags,
        diaryEntry
      )

      await expect(promise).rejects.toEqual(
        new NotFoundException(`Search tag '${searchTagValue}' was not found.`)
      )
    })
  })

  describe('updateMany', () => {
    const diaryEntry: DiaryEntry = {
      _id: new ObjectId(),
      title: 'some title',
      location: 'some location',
      body: 'some body',
      searchTags: ['some tag', 'some other tag'],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const searchTags = ['some other tag', 'yet another tag']

    let addDiaryEntryToMany: jest.SpyInstance<
    Promise<SearchTag[]>,
    [string[], DiaryEntry]
    >

    let removeDiaryEntryFromMany: jest.SpyInstance<
    Promise<SearchTag[]>,
    [string[], DiaryEntry]
    >

    beforeEach(() => {
      addDiaryEntryToMany = jest
        .spyOn(service, 'addDiaryEntryToMany')
        .mockImplementation(async (searchTags, diaryEntry) => await Promise.resolve([]))
    })

    beforeEach(() => {
      removeDiaryEntryFromMany = jest
        .spyOn(service, 'removeDiaryEntryFromMany')
        .mockImplementation(async (searchTags, diaryEntry) => await Promise.resolve([]))
    })

    beforeEach(async () => {
      await service.updateMany(searchTags, diaryEntry)
    })

    it('addDiaryEntryToMany should have been called', () => {
      expect(addDiaryEntryToMany).toHaveBeenCalledWith(
        ['yet another tag'],
        diaryEntry
      )
    })

    it('removeDiaryEntryFromMany should have been called', () => {
      expect(removeDiaryEntryFromMany).toHaveBeenCalledWith(
        ['some tag'],
        diaryEntry
      )
    })
  })
})
