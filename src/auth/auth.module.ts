import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminsModule } from './admins/admins.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtConfigModule } from './jwt-config/jwt-config.module';
import { JwtConfigService } from './jwt-config/jwt-config.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [JwtConfigModule],
      useExisting: JwtConfigService,
    }),
    AdminsModule,
    JwtConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
