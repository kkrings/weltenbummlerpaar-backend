import { DateRangeJson } from './date-range.json';
import { ImageJson } from './image.json';

export interface DiaryEntryJson {
  id: string;
  title: string;
  location: string;
  dateRange?: DateRangeJson;
  body: string;
  searchTags: string[];
  previewImage?: ImageJson;
  images: ImageJson[];
  createdAt: string;
  updatedAt: string;
}
