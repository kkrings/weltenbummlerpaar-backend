import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { appConstants } from './app.constants';
import { version } from '../package.json';

export function setupOpenApi(app: INestApplication, path: string): void {
  const config = new DocumentBuilder()
    .setTitle(appConstants.apiTitle)
    .setDescription(appConstants.apiDescription)
    .setVersion(version)
    .addTag(appConstants.apiTags.welcome)
    .addTag(appConstants.apiTags.authentication)
    .addTag(appConstants.apiTags.diaryEntries)
    .addTag(appConstants.apiTags.searchTags)
    .addTag(appConstants.apiTags.images)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(path, app, document);
}
