import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupOpenApi } from './openapi';
import { CorsConfigService } from './cors/cors-config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  setupOpenApi(app);

  const corsConfigService = app.get(CorsConfigService);
  app.enableCors(corsConfigService.createCorsOptions());

  await app.listen(3000);
}

bootstrap().then(undefined, (error) => {
  console.error('Bootstrapping application failed:', error);
  process.exitCode = 1;
});
