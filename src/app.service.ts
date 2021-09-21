import { Injectable } from '@nestjs/common';
import { appConstants } from './app.constants';

@Injectable()
export class AppService {
  welcome(): string {
    return appConstants.apiDescription;
  }
}
