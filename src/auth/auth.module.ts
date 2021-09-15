import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigModule } from './jwt-config/jwt-config.module';
import { JwtConfigService } from './jwt-config/jwt-config.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [JwtConfigModule],
      useExisting: JwtConfigService,
    }),
  ],
})
export class AuthModule {}
