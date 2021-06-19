import { Test, TestingModule } from '@nestjs/testing'
import { SearchTagsController } from './search-tags.controller'
import { SearchTagsService } from './search-tags.service'

describe('SearchTagsController', () => {
  const referenceSearchTags = ['some search tag']

  const mockService = {
    findSearchTags: async () => await Promise.resolve(referenceSearchTags)
  }

  let controller: SearchTagsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchTagsController],
      providers: [
        {
          provide: SearchTagsService,
          useValue: mockService
        }
      ]
    }).compile()

    controller = module.get<SearchTagsController>(SearchTagsController)
  })

  describe('findSearchTags()', () => {
    const findSearchTagsSpy = jest.spyOn(mockService, 'findSearchTags')

    let searchTags: string[]

    beforeEach(async () => {
      searchTags = await controller.findSearchTags()
    })

    it('should return reference search tags', () => {
      expect(searchTags).toEqual(referenceSearchTags)
    })

    it('should have called service', () => {
      expect(findSearchTagsSpy).toHaveBeenCalled()
    })
  })
})
