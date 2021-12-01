import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from './app.config';

@Injectable()
export class AppConfigService {
  readonly port: number;
  readonly prefix: string;

  constructor(@Inject(appConfig.KEY) config: ConfigType<typeof appConfig>) {
    this.port = parseInt(config.port);
    this.prefix = config.prefix ?? '';
  }

  get openApiPath(): string {
    return `${this.prefix}/docs`;
  }
}
