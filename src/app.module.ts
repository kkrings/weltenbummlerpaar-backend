import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DiaryEntriesModule } from './diary-entries/diary-entries.module'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/weltenbummlerpaar'),
    DiaryEntriesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
