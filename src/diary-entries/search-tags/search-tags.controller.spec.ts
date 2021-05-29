import { Test, TestingModule } from '@nestjs/testing'
import { SearchTagsController } from './search-tags.controller'
import { SearchTagsService } from './search-tags.service'

describe('SearchTagsController', () => {
  let controller: SearchTagsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchTagsController],
      providers: [SearchTagsService]
    }).compile()

    controller = module.get<SearchTagsController>(SearchTagsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
