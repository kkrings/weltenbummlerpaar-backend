import { ConfigModule } from '@nestjs/config';
import { TestingModule, Test, TestingModuleBuilder } from '@nestjs/testing';
import { env } from 'process';
import { CorsConfigService, CorsOptions } from './cors-config.service';
import corsConfig from './cors.config';

describe('CorsConfigService', () => {
  let moduleBuilder: TestingModuleBuilder;
  let service: CorsConfigService;
  let oldCorsOrigins: string;
  let corsOptions: CorsOptions;

  beforeEach(() => {
    oldCorsOrigins = env.WELTENBUMMLERPAAR_BACKEND_CORS_ORIGINS;
  });

  beforeEach(() => {
    moduleBuilder = Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [corsConfig],
          ignoreEnvFile: true,
        }),
      ],
      providers: [CorsConfigService],
    });
  });

  describe('non-empty CORS origins array', () => {
    const corsOrigins = ['http://localhost:4200'];

    beforeEach(() => {
      env.WELTENBUMMLERPAAR_BACKEND_CORS_ORIGINS = corsOrigins.join(',');
    });

    beforeEach(async () => {
      const module: TestingModule = await moduleBuilder.compile();
      service = module.get<CorsConfigService>(CorsConfigService);
    });

    beforeEach(() => {
      corsOptions = service.createCorsOptions();
    });

    it('CORS origins shoud have been set to CORS origins array', () => {
      expect(corsOptions.origins).toEqual(corsOrigins);
    });
  });

  describe('empty CORS origins array', () => {
    beforeEach(() => {
      env.WELTENBUMMLERPAAR_BACKEND_CORS_ORIGINS = [].join(',');
    });

    beforeEach(async () => {
      const module: TestingModule = await moduleBuilder.compile();
      service = module.get<CorsConfigService>(CorsConfigService);
    });

    beforeEach(() => {
      corsOptions = service.createCorsOptions();
    });

    it('CORS origins shoud have been set to false', () => {
      expect(corsOptions.origins).toEqual(false);
    });
  });

  afterEach(() => {
    env.WELTENBUMMLERPAAR_BACKEND_CORS_ORIGINS = oldCorsOrigins;
  });
});
