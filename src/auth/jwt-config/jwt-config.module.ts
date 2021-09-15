import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtConfigService } from './jwt-config.service';
import jwtConfig from './jwt.config';

@Module({
  imports: [ConfigModule.forFeature(jwtConfig)],
  providers: [JwtConfigService],
  exports: [JwtConfigService],
})
export class JwtConfigModule {}
