import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import databaseConfig from './database.config';

@Injectable()
export class DatabaseConfigService implements MongooseOptionsFactory {
  constructor(
    @Inject(databaseConfig.KEY)
    private readonly config: ConfigType<typeof databaseConfig>,
  ) {}

  createMongooseOptions(): MongooseModuleOptions {
    return { uri: this.config.uri, ...this.config.options };
  }
}
