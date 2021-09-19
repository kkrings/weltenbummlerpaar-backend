import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { version } from '../package.json';

export function setupOpenApi(app: INestApplication): void {
  const description =
    'REST API of the Weltenbummlerpaar travel diary application';

  const config = new DocumentBuilder()
    .setTitle('Weltenbummlerpaar REST API')
    .setDescription(description)
    .setVersion(version)
    .addTag('Authentication')
    .addTag('Diary entries')
    .addTag('Diary entry search tags')
    .addTag('Diary entry images')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
}
