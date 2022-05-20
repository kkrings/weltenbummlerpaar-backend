import helmet from 'helmet';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { version } from '../package.json';
import { appConstants } from './app.constants';
import { CorsConfigService } from './cors/cors-config.service';

export function setupPipes(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
}

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

export function setupCors(app: INestApplication): void {
  const corsConfigService = app.get(CorsConfigService);
  const corsOptions = corsConfigService.createCorsOptions();
  const corpOptions = corsConfigService.createCorpOptions(corsOptions);
  app.enableCors(corsOptions);
  app.use(helmet(corpOptions));
}
