import { UnsupportedMediaTypeException } from '@nestjs/common'
import { MulterModuleOptions } from '@nestjs/platform-express'
import { Test, TestingModule } from '@nestjs/testing'
import { ImageUploadConfigService } from './image-upload-config.service'
import imageUploadConfig, { ImageUploadConfig } from './image-upload.config'

describe('ImageUploadConfigService', () => {
  let service: ImageUploadConfigService

  const mockConfig: ImageUploadConfig = {
    destination: 'some destination',
    manipulation: { imageWidth: 2500, imageQuality: 75 }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: imageUploadConfig.KEY,
          useValue: mockConfig

        },
        ImageUploadConfigService
      ]
    }).compile()

    service = module.get<ImageUploadConfigService>(ImageUploadConfigService)
  })

  describe('createMulterOptions', () => {
    let multerOptions: MulterModuleOptions

    beforeEach(() => {
      multerOptions = service.createMulterOptions()
    })

    it('should return destination', () => {
      expect(multerOptions.dest).toEqual(mockConfig.destination)
    })

    it('should return file filter', () => {
      expect(multerOptions).not.toBeNull()
    })
  })

  describe('jpegFilter', () => {
    it('should accept file of type image/jpeg', done => {
      const runTest = (error: Error | null, acceptFile?: boolean): void => {
        try {
          expect(error).toBeNull()
          expect(acceptFile).toBeTruthy()
          done()
        } catch (failure) {
          done(failure)
        }
      }

      service.jpegFilter('image/jpeg', runTest)
    })

    it('should return error', done => {
      const runTest = (error: Error | null, accceptFile?: boolean): void => {
        try {
          expect(error instanceof UnsupportedMediaTypeException).toBeTruthy()
          expect(accceptFile).toBeUndefined()
          done()
        } catch (failure) {
          done(failure)
        }
      }

      service.jpegFilter('image/png', runTest)
    })
  })
})
