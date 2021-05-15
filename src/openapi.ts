import { INestApplication } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { version } from '../package.json'

export function setupOpenApi (app: INestApplication): void {
  const description = (
    'REST API of the Weltenbummlerpaar travel diary application'
  )

  const config = new DocumentBuilder()
    .setTitle('Weltenbummlerpaar REST API')
    .setDescription(description)
    .setVersion(version)
    .addTag('Diary entries')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('docs', app, document)
}
