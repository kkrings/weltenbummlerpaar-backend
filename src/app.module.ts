import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfigService } from './database/database-config.service';
import { DatabaseModule } from './database/database.module';
import { DiaryEntriesModule } from './diary-entries/diary-entries.module';
import { validateConfig } from './config/config.validation';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: validateConfig }),
    MongooseModule.forRootAsync({
      imports: [DatabaseModule],
      useExisting: DatabaseConfigService,
    }),
    DiaryEntriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
