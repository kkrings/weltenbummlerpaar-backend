import { NestFactory } from '@nestjs/core';
import { NestApplicationOptions } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { setupPipes, setupOpenApi, setupCors } from './setup';
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

  setupPipes(app);
  setupOpenApi(app, appConfigService.openApiPath);
  setupCors(app);

  await app.listen(appConfigService.port);
}

bootstrap().then(undefined, (error) => {
  console.error('Bootstrapping application failed:', error);
  process.exitCode = 1;
});
