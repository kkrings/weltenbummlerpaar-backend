import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupOpenApi } from './openapi'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule)
  setupOpenApi(app)
  await app.listen(3000)
}

bootstrap().then(undefined, (error) => {
  console.error('Bootstrapping application failed:', error)
  process.exitCode = 1
})
