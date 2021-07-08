import { Injectable, NotFoundException } from '@nestjs/common'
import { DiaryEntry } from './schemas/diary-entry.schema'
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto'
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto'
import { DiaryEntriesDBService } from './diary-entries.db.service'
import { ImagesService } from './images/images.service'
import { SearchTagsService } from './search-tags/search-tags.service'
import { CreateImageDto } from './images/dto/create-image.dto'

@Injectable()
export class DiaryEntriesService {
  constructor (
    private readonly diaryEntriesDBService: DiaryEntriesDBService,
    private readonly searchTagsService: SearchTagsService,
    private readonly imagesService: ImagesService
  ) {}

  async create (createDiaryEntryDto: CreateDiaryEntryDto): Promise<DiaryEntry> {
    const diaryEntry = await this.diaryEntriesDBService.create(createDiaryEntryDto)

    await this.searchTagsService.addDiaryEntryToMany(
      createDiaryEntryDto.searchTags,
      diaryEntry
    )

    return diaryEntry
  }

  async findMany (): Promise<DiaryEntry[]> {
    return await this.diaryEntriesDBService.findMany()
  }

  async findOne (diaryEntryId: string): Promise<DiaryEntry> {
    return await this.diaryEntriesDBService.findOne(diaryEntryId)
  }

  async updateOne (
    diaryEntryId: string,
    updateDiaryEntryDto: UpdateDiaryEntryDto
  ): Promise<DiaryEntry> {
    const diaryEntry = await this.findOne(diaryEntryId)

    if (updateDiaryEntryDto.images !== undefined) {
      this.validateReorderedImageIds(updateDiaryEntryDto.images, diaryEntry)
    }

    await this.diaryEntriesDBService.updateOne(diaryEntryId, updateDiaryEntryDto)

    if (updateDiaryEntryDto.searchTags !== undefined) {
      await this.searchTagsService.updateMany(
        updateDiaryEntryDto.searchTags,
        diaryEntry
      )
    }

    return await this.findOne(diaryEntryId)
  }

  async removeOne (diaryEntryId: string): Promise<DiaryEntry> {
    const diaryEntry = await this.diaryEntriesDBService.removeOne(diaryEntryId)

    await this.searchTagsService.removeDiaryEntryFromMany(
      diaryEntry.searchTags,
      diaryEntry
    )

    await this.imagesService.removeMany(diaryEntry.images)

    return diaryEntry
  }

  async addImage (
    diaryEntryId: string,
    createImageDto: CreateImageDto
  ): Promise<DiaryEntry> {
    const diaryEntry = await this.findOne(diaryEntryId)
    const image = await this.imagesService.create(createImageDto, diaryEntry)
    return await this.diaryEntriesDBService.addImage(diaryEntryId, image)
  }

  async removeImage (diaryEntryId: string, imageId: string): Promise<DiaryEntry> {
    const diaryEntry = await this.findOne(diaryEntryId)
    this.validateImageId(imageId, diaryEntry)
    const image = await this.imagesService.removeOne(imageId)
    return await this.diaryEntriesDBService.removeImage(diaryEntryId, image)
  }

  private validateReorderedImageIds (imageIds: string[], diaryEntry: DiaryEntry): void {
    const compareImageIds = (imageId: string, otherImageId: string): number => (
      imageId < otherImageId ? -1 : imageId > otherImageId ? 1 : 0
    )

    const sortedImageIds = [...imageIds].sort(compareImageIds)

    const diaryEntrySortedImageIds = diaryEntry.images
      .map(image => image._id.toHexString())
      .sort(compareImageIds)

    if (
      sortedImageIds.length !== diaryEntrySortedImageIds.length ||
      sortedImageIds.some((id, index) => id !== diaryEntrySortedImageIds[index])
    ) {
      throw new NotFoundException('Request body contains unknown image IDs.')
    }
  }

  private validateImageId (imageId: string, diaryEntry: DiaryEntry): void {
    if (diaryEntry.images.every(image => image._id.toHexString() !== imageId)) {
      throw new NotFoundException(
        `Diary entry does not contain image with ID ${imageId}.`
      )
    }
  }
}
