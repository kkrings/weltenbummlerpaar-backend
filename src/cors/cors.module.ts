import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CorsConfigService } from './cors-config.service';
import corsConfig from './cors.config';

@Module({
  imports: [ConfigModule.forFeature(corsConfig)],
  providers: [CorsConfigService],
  exports: [CorsConfigService],
})
export class CorsModule {}
