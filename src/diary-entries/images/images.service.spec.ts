import { Test, TestingModule } from '@nestjs/testing'
import { ImageUploadService } from './image-upload/image-upload.service'
import { ImageUploadServiceMock } from './image-upload/image-upload.service.mock'
import { ImagesDBService } from './images.db.service'
import { ImagesDBServiceMock } from './images.db.service.mock'
import { ImagesService } from './images.service'
import { Image } from './schemas/image.schema'

describe('ImagesService', () => {
  let imagesCollection: Image[]
  let service: ImagesService

  beforeEach(() => {
    imagesCollection = []
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'ImagesCollection',
          useValue: imagesCollection
        },
        {
          provide: ImagesDBService,
          useClass: ImagesDBServiceMock
        },
        {
          provide: ImageUploadService,
          useClass: ImageUploadServiceMock
        },
        ImagesService
      ]
    }).compile()

    service = module.get<ImagesService>(ImagesService)
  })

  it('service is defined', () => {
    expect(service).toBeDefined()
  })
})
