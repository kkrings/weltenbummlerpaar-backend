import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ObjectId } from 'mongodb'
import { DiaryEntry } from '../schemas/diary-entry.schema'
import { CreateImageDto } from './dto/create-image.dto'
import { UpdateImageDto } from './dto/update-image.dto'
import { ImageUploadService } from './image-upload/image-upload.service'
import { ImageUploadServiceMock } from './image-upload/image-upload.service.mock'
import { ImagesDBService } from './images.db.service'
import { ImagesDBServiceMock } from './images.db.service.mock'
import { ImagesService } from './images.service'
import { Image } from './schemas/image.schema'

describe('ImagesService', () => {
  let imagesCollection: Image[]
  let imagesService: ImagesService
  let imageUploadService: ImageUploadService

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

    imagesService = module.get<ImagesService>(ImagesService)
    imageUploadService = module.get<ImageUploadService>(ImageUploadService)
  })

  describe('create', () => {
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

    const createImageDto: CreateImageDto = {
      description: 'some description',
      imageUpload: 'some path'
    }

    let moveImageSpy: jest.SpyInstance
    let image: Image
    let expectedImage: Image

    beforeEach(() => {
      moveImageSpy = jest.spyOn(imageUploadService, 'moveImage')
    })

    beforeEach(async () => {
      image = await imagesService.create(createImageDto, diaryEntry)
    })

    beforeEach(() => {
      expect(imagesCollection.length).toEqual(1)
      expectedImage = imagesCollection[0]
    })

    it('image should have been created', () => {
      expect(image).toEqual(expectedImage)
    })

    it('created image should be related to diary entry', () => {
      expect(image.diaryEntryId).toEqual(diaryEntry._id)
    })

    it('moveImage should have been called', () => {
      expect(moveImageSpy).toHaveBeenCalledWith(createImageDto.imageUpload, image)
    })
  })

  describe('updateOne', () => {
    const image: Image = {
      _id: new ObjectId(),
      description: 'some description',
      diaryEntryId: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    describe('with description, without image upload', () => {
      const updateImageDto: UpdateImageDto = {
        description: 'some updated description'
      }

      describe('on image found', () => {
        let updatedImage: Image

        beforeEach(() => {
          imagesCollection.push({ ...image })
        })

        beforeEach(async () => {
          updatedImage = await imagesService.updateOne(
            image._id.toHexString(),
            updateImageDto
          )
        })

        it('image in database should have been returned', () => {
          expect(updatedImage).toEqual(imagesCollection[0])
        })

        it('image in database should have been updated', () => {
          const imageInDB = imagesCollection[0]
          expect(imageInDB._id).toEqual(image._id)
          expect(imageInDB.description).toEqual(updateImageDto.description)
          expect(imageInDB.diaryEntryId).toEqual(image.diaryEntryId)
          expect(imageInDB.createdAt).toEqual(image.createdAt)
          expect(imageInDB.updatedAt).not.toEqual(image.updatedAt)
        })
      })

      describe('on image not found', () => {
        const imageId = new ObjectId().toHexString()
        let imagePromise: Promise<Image>

        beforeEach(() => {
          imagePromise = imagesService.updateOne(imageId, updateImageDto)
        })

        it('not-found execption should have been thrown', async () => {
          await expect(imagePromise).rejects.toEqual(
            new NotFoundException(`Document with ID '${imageId}' could not be found.`)
          )
        })
      })
    })

    describe('without description, with image upload', () => {
      const updateImageDto: UpdateImageDto = {
        imageUpload: 'some path'
      }

      describe('on image found', () => {
        let moveImageSpy: jest.SpyInstance
        let updatedImage: Image

        beforeEach(() => {
          moveImageSpy = jest.spyOn(imageUploadService, 'moveImage')
        })

        beforeEach(() => {
          imagesCollection.push({ ...image })
        })

        beforeEach(async () => {
          updatedImage = await imagesService.updateOne(
            image._id.toHexString(),
            updateImageDto
          )
        })

        it('image in database should have been returned', () => {
          expect(updatedImage).toEqual(imagesCollection[0])
        })

        it('image in database should not have been updated', () => {
          expect(imagesCollection[0]).toEqual(image)
        })

        it('moveImage should have been called', () => {
          expect(moveImageSpy).toHaveBeenCalledWith(
            updateImageDto.imageUpload,
            updatedImage
          )
        })
      })

      describe('on image not found', () => {
        const imageId = new ObjectId().toHexString()

        let removeUploadSpy: jest.SpyInstance
        let imagePromise: Promise<Image>

        beforeEach(() => {
          removeUploadSpy = jest.spyOn(imageUploadService, 'removeUpload')
        })

        beforeEach(() => {
          imagePromise = imagesService.updateOne(imageId, updateImageDto)
        })

        it('not-found exception should have been thrown', async () => {
          await expect(imagePromise).rejects.toEqual(
            new NotFoundException(`Document with ID '${imageId}' could not be found.`)
          )
        })

        it('removeUpload should have been called', async () => {
          try {
            await imagePromise
          } catch {
            // do nothing
          }

          expect(removeUploadSpy).toHaveBeenCalledWith(updateImageDto.imageUpload)
        })
      })
    })
  })

  describe('removeOne', () => {
    const image: Image = {
      _id: new ObjectId(),
      description: 'some description',
      diaryEntryId: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    describe('on image found', () => {
      let removeImageSpy: jest.SpyInstance
      let removedImage: Image

      beforeEach(() => {
        removeImageSpy = jest.spyOn(imageUploadService, 'removeImage')
      })

      beforeEach(() => {
        imagesCollection.push({ ...image })
      })

      beforeEach(async () => {
        removedImage = await imagesService.removeOne(image._id.toHexString())
      })

      it('image removed from database should have been returned', () => {
        expect(removedImage).toEqual(image)
      })

      it('image in database should have been removed', () => {
        expect(imagesCollection.length).toEqual(0)
      })

      it('removeImage should have been called', () => {
        expect(removeImageSpy).toHaveBeenCalledWith(removedImage)
      })
    })

    describe('on image not found', () => {
      const imageId = image._id.toHexString()
      let imagePromise: Promise<Image>

      beforeEach(() => {
        imagePromise = imagesService.removeOne(imageId)
      })

      it('not-found exception should have been thrown', async () => {
        await expect(imagePromise).rejects.toEqual(
          new NotFoundException(`Document with ID '${imageId}' could not be found.`)
        )
      })
    })
  })

  describe('removeMany', () => {
    let removeImageSpy: jest.SpyInstance

    const image: Image = {
      _id: new ObjectId(),
      description: 'some description',
      diaryEntryId: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    beforeEach(() => {
      removeImageSpy = jest.spyOn(imageUploadService, 'removeImage')
    })

    beforeEach(() => {
      imagesCollection.push({ ...image })
    })

    beforeEach(async () => {
      await imagesService.removeMany([image])
    })

    it('image in database should have been removed', () => {
      expect(imagesCollection.length).toEqual(0)
    })

    it('removeImage should have been called', () => {
      expect(removeImageSpy).toHaveBeenLastCalledWith(image)
    })
  })
})
