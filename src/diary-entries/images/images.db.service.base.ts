import { DiaryEntry } from '../schemas/diary-entry.schema';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Image } from './schemas/image.schema';

export abstract class ImagesDBServiceBase {
  abstract create(
    createImageDto: CreateImageDto,
    diaryEntry: DiaryEntry,
  ): Promise<Image>;

  abstract updateOne(
    imageId: string,
    updateImageDto: UpdateImageDto,
  ): Promise<Image>;
  abstract removeOne(imageId: string): Promise<Image>;
  abstract removeMany(images: Image[]): AsyncIterable<Image>;
}
