import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { env } from 'process';
import { AppConfigService } from './app-config.service';
import appConfig from './app.config';

describe('AppConfigService', () => {
  const port = 3000;

  let oldPort: string | undefined;
  let oldPrefix: string | undefined;

  let service: AppConfigService;

  const setAppConfigService = async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [appConfig],
          ignoreEnvFile: true,
        }),
      ],
      providers: [AppConfigService],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
  };

  beforeEach(() => {
    oldPort = env.WELTENBUMMLERPAAR_BACKEND_APP_PORT;
    oldPrefix = env.WELTENBUMMLERPAAR_BACKEND_APP_PREFIX;
  });

  beforeEach(() => {
    env.WELTENBUMMLERPAAR_BACKEND_APP_PORT = `${port}`;
  });

  describe('port and prefix', () => {
    const prefix = 'api';

    beforeEach(() => {
      env.WELTENBUMMLERPAAR_BACKEND_APP_PREFIX = prefix;
    });

    beforeEach(async () => {
      await setAppConfigService();
    });

    it('port should have been read from env', () => {
      expect(service.port).toEqual(port);
    });

    it('prefix should have been read from env', () => {
      expect(service.prefix).toEqual(prefix);
    });

    it('openApiPath should be prefixed', () => {
      expect(service.openApiPath).toEqual(`${prefix}/docs`);
    });
  });

  describe('no prefix', () => {
    beforeEach(() => {
      delete env.WELTENBUMMLERPAAR_BACKEND_APP_PREFIX;
    });

    beforeEach(async () => {
      await setAppConfigService();
    });

    it('prefix should be an empty string', () => {
      expect(service.prefix).toEqual('');
    });

    it('openApiPath should not be prefixed', () => {
      expect(service.openApiPath).toEqual('/docs');
    });
  });

  afterEach(() => {
    env.WELTENBUMMLERPAAR_BACKEND_APP_PORT = oldPort;
    env.WELTENBUMMLERPAAR_BACKEND_APP_PREFIX = oldPrefix;
  });
});
