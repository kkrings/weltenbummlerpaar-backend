import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DiaryEntriesModule } from './diary-entries/diary-entries.module'
import imageUploadConfig from './diary-entries/images/image-upload/image-upload.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [imageUploadConfig]
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/weltenbummlerpaar', {
      useCreateIndex: true,
      useFindAndModify: false
    }),
    DiaryEntriesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
