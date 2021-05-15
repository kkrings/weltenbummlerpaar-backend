import { Test, TestingModule } from '@nestjs/testing'
import { DiaryEntriesController } from './diary-entries.controller'
import { DiaryEntriesService } from './diary-entries.service'

describe('DiaryEntriesController', () => {
  let controller: DiaryEntriesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiaryEntriesController],
      providers: [DiaryEntriesService]
    }).compile()

    controller = module.get<DiaryEntriesController>(DiaryEntriesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
