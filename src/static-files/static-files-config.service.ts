import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  ServeStaticModuleOptionsFactory,
  ServeStaticModuleOptions,
} from '@nestjs/serve-static';
import staticFilesConfig from './static-files.config';

export class StaticFilesConfigService
  implements ServeStaticModuleOptionsFactory
{
  constructor(
    @Inject(staticFilesConfig.KEY)
    private readonly config: ConfigType<typeof staticFilesConfig>,
  ) {}

  createLoggerOptions(): ServeStaticModuleOptions[] {
    return [{ rootPath: this.config.rootPath }];
  }
}
