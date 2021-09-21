import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { appConstants } from './app.constants';
import { AppService } from './app.service';

@ApiTags(appConstants.apiTags.welcome)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  welcome(): string {
    return this.appService.welcome();
  }
}
