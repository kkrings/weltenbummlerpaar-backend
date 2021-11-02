import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StaticFilesConfigService } from './static-files-config.service';
import staticFilesConfig from './static-files.config';

@Module({
  imports: [ConfigModule.forFeature(staticFilesConfig)],
  providers: [StaticFilesConfigService],
  exports: [StaticFilesConfigService],
})
export class StaticFilesModule {}
