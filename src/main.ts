import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { CorsConfigService } from './cors/cors-config.service';
import { setupOpenApi } from './openapi';
import { readHttpsCerts } from './https';

async function appOptions(): Promise<NestApplicationOptions> {
  const httpsCerts = await readHttpsCerts();

  return httpsCerts.key && httpsCerts.cert
    ? { httpsOptions: { ...httpsCerts } }
    : {};
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, await appOptions());

  const appConfigService = app.get(AppConfigService);
  app.setGlobalPrefix(appConfigService.prefix);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  setupOpenApi(app, appConfigService.openApiPath);

  const corsConfigService = app.get(CorsConfigService);
  const corsOptions = corsConfigService.createCorsOptions();
  const corpOptions = corsConfigService.createCorpOptions(corsOptions);

  app.enableCors(corsOptions);
  app.use(helmet(corpOptions));

  await app.listen(appConfigService.port);
}

bootstrap().then(undefined, (error) => {
  console.error('Bootstrapping application failed:', error);
  process.exitCode = 1;
});
