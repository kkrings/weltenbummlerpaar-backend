import { Test, TestingModule } from '@nestjs/testing'
import { SearchTagsService } from './search-tags.service'

describe('SearchTagsService', () => {
  let service: SearchTagsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchTagsService]
    }).compile()

    service = module.get<SearchTagsService>(SearchTagsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
