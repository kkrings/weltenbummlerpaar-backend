import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import jwtConfig from './jwt.config';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
  ) {}

  createJwtOptions(): JwtModuleOptions {
    return { secret: this.jwtSecret };
  }

  get jwtSecret(): string {
    return this.config.secret;
  }
}
