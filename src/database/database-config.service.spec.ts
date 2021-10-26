import { ConfigModule } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { TestingModule, Test } from '@nestjs/testing';
import { env } from 'process';
import { DatabaseConfigService } from './database-config.service';
import databaseConfig from './database.config';

describe('DatabaseConfigService', () => {
  const databaseUri = 'some URI';

  let oldDatabaseUri: string;
  let service: DatabaseConfigService;
  let databaseOptions: MongooseModuleOptions;

  beforeAll(() => {
    oldDatabaseUri = env.WELTENBUMMLERPAAR_BACKEND_DATABASE_URI;
    env.WELTENBUMMLERPAAR_BACKEND_DATABASE_URI = databaseUri;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [databaseConfig],
          ignoreEnvFile: true,
        }),
      ],
      providers: [DatabaseConfigService],
    }).compile();

    service = module.get<DatabaseConfigService>(DatabaseConfigService);
  });

  beforeEach(() => {
    databaseOptions = service.createMongooseOptions();
  });

  it('database URI should have been returned', () => {
    expect(databaseOptions.uri).toEqual(databaseUri);
  });

  afterAll(() => {
    env.WELTENBUMMLERPAAR_BACKEND_DATABASE_URI = oldDatabaseUri;
  });
});
