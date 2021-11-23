import { ConfigModule } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { TestingModule, Test } from '@nestjs/testing';
import { env } from 'process';
import { DatabaseConfigService } from './database-config.service';
import databaseConfig from './database.config';

describe('DatabaseConfigService', () => {
  let oldDatabaseUri: string;
  let oldDatabaseAutoIndex: string;
  let databaseOptions: MongooseModuleOptions;

  const loadDatabaseOptions = async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [databaseConfig],
          ignoreEnvFile: true,
        }),
      ],
      providers: [DatabaseConfigService],
    }).compile();

    const service = module.get<DatabaseConfigService>(DatabaseConfigService);
    databaseOptions = service.createMongooseOptions();
  };

  beforeEach(() => {
    oldDatabaseUri = env.WELTENBUMMLERPAAR_BACKEND_DATABASE_URI;
    oldDatabaseAutoIndex = env.WELTENBUMMLERPAAR_BACKEND_DATABASE_AUTO_INDEX;
  });

  it('database URI should have been returned', async () => {
    const databaseUri = 'some database URI';
    env.WELTENBUMMLERPAAR_BACKEND_DATABASE_URI = databaseUri;
    await loadDatabaseOptions();
    expect(databaseOptions.uri).toEqual(databaseUri);
  });

  it('database auto index of true should have been returned', async () => {
    env.WELTENBUMMLERPAAR_BACKEND_DATABASE_AUTO_INDEX = 'true';
    await loadDatabaseOptions();
    expect(databaseOptions.autoIndex).toEqual(true);
  });

  it('database auto index of false should have been returned', async () => {
    env.WELTENBUMMLERPAAR_BACKEND_DATABASE_AUTO_INDEX = 'false';
    await loadDatabaseOptions();
    expect(databaseOptions.autoIndex).toEqual(false);
  });

  afterEach(() => {
    env.WELTENBUMMLERPAAR_BACKEND_DATABASE_URI = oldDatabaseUri;
    env.WELTENBUMMLERPARR_BACKEND_DATABASE_AUTO_INDEX = oldDatabaseAutoIndex;
  });
});
