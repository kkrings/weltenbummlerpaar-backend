import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DiaryEntriesModule } from './diary-entries/diary-entries.module'

@Module({
  imports: [DiaryEntriesModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
