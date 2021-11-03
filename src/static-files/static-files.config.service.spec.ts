import { ConfigModule } from '@nestjs/config';
import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { TestingModule, TestingModuleBuilder, Test } from '@nestjs/testing';
import { env } from 'process';
import { StaticFilesConfigService } from './static-files-config.service';
import staticFilesConfig from './static-files.config';

describe('StaticFilesConfigService', () => {
  let oldRootPath: string;
  let moduleBuilder: TestingModuleBuilder;
  let service: StaticFilesConfigService;
  let staticFilesOptions: ServeStaticModuleOptions[];

  beforeEach(() => {
    oldRootPath = env.WELTENBUMMLERPAAR_BACKEND_STATIC_FILES_ROOT_PATH;
  });

  beforeEach(() => {
    moduleBuilder = Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [staticFilesConfig],
          ignoreEnvFile: true,
        }),
      ],
      providers: [StaticFilesConfigService],
    });
  });

  describe('without root path', () => {
    beforeEach(() => {
      delete env.WELTENBUMMLERPAAR_BACKEND_STATIC_FILES_ROOT_PATH;
    });

    beforeEach(async () => {
      const module: TestingModule = await moduleBuilder.compile();
      service = module.get<StaticFilesConfigService>(StaticFilesConfigService);
    });

    beforeEach(() => {
      staticFilesOptions = service.createLoggerOptions();
    });

    it('empty module options array should have been returned', () => {
      expect(staticFilesOptions).toHaveLength(0);
    });
  });

  describe('with root path', () => {
    const rootPath = '/workspace/public';

    beforeEach(() => {
      env.WELTENBUMMLERPAAR_BACKEND_STATIC_FILES_ROOT_PATH = rootPath;
    });

    beforeEach(async () => {
      const module: TestingModule = await moduleBuilder.compile();
      service = module.get<StaticFilesConfigService>(StaticFilesConfigService);
    });

    beforeEach(() => {
      staticFilesOptions = service.createLoggerOptions();
    });

    it('root path should have been returned', () => {
      expect(staticFilesOptions).toEqual([{ rootPath }]);
    });
  });

  afterEach(() => {
    env.WELTENBUMMLERPAAR_BACKEND_STATIC_FILES_ROOT_PATH = oldRootPath;
  });
});
