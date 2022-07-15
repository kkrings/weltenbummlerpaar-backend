import { INestApplication } from '@nestjs/common';
import { DatabaseConfigService } from './../src/database/database-config.service';
import { ImageUploadConfigService } from './../src/diary-entries/images/image-upload/image-upload-config.service';

export function getDatabaseUri(app: INestApplication): string {
  const config = app.get(DatabaseConfigService).createMongooseOptions();
  expect(config.uri).toBeDefined();
  return config.uri as string;
}

export function getImageUploadDir(app: INestApplication): string {
  const config = app.get(ImageUploadConfigService).createMulterOptions();
  expect(config.dest).toBeDefined();
  return config.dest as string;
}

export const dateIsGreaterThan = (left: string, right: string): void =>
  expect(new Date(left) > new Date(right)).toBeTruthy();
