import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfigService } from './database/database-config.service';
import { DatabaseModule } from './database/database.module';
import { DiaryEntriesModule } from './diary-entries/diary-entries.module';
import { validateConfig } from './config/config.validation';
import { AuthModule } from './auth/auth.module';
import { CorsModule } from './cors/cors.module';
import { StaticFilesModule } from './static-files/static-files.module';
import { StaticFilesConfigService } from './static-files/static-files-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: validateConfig }),
    MongooseModule.forRootAsync({
      imports: [DatabaseModule],
      useExisting: DatabaseConfigService,
    }),
    ServeStaticModule.forRootAsync({
      imports: [StaticFilesModule],
      useExisting: StaticFilesConfigService,
    }),
    DiaryEntriesModule,
    AuthModule,
    CorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
