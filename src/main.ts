import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule)

  const description = (
    'REST API of the Weltenbummlerpaar travel diary web application'
  )

  const config = new DocumentBuilder()
    .setTitle('Weltenbummlerpaar REST API')
    .setDescription(description)
    .setVersion('2.0.0')
    .addTag('Diary entries')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('docs', app, document)

  await app.listen(3000)
}

bootstrap().then(undefined, (error) => {
  console.error('Bootstrapping application failed:', error)
  process.exit(1)
})
