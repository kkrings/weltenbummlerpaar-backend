import { Test, TestingModule } from '@nestjs/testing'
import { DiaryEntriesService } from './diary-entries.service'

describe('DiaryEntriesService', () => {
  let service: DiaryEntriesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiaryEntriesService]
    }).compile()

    service = module.get<DiaryEntriesService>(DiaryEntriesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
