import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModuleOptions } from '@nestjs/jwt';
import { env } from 'process';
import { JwtConfigService } from './jwt-config.service';
import jwtConfig from './jwt.config';

describe('JwtConfigService', () => {
  const jwtSecret = 'some secret';

  let oldJwtSecret: string | undefined;
  let service: JwtConfigService;
  let jwtOptions: JwtModuleOptions;

  beforeAll(() => {
    oldJwtSecret = env.WELTENBUMMLERPAAR_BACKEND_JWT_SECRET;
    env.WELTENBUMMLERPAAR_BACKEND_JWT_SECRET = jwtSecret;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [jwtConfig],
          ignoreEnvFile: true,
        }),
      ],
      providers: [JwtConfigService],
    }).compile();

    service = module.get<JwtConfigService>(JwtConfigService);
  });

  beforeEach(() => {
    jwtOptions = service.createJwtOptions();
  });

  it('JWT secret should have been returned', () => {
    expect(jwtOptions.secret).toEqual(jwtSecret);
  });

  afterAll(() => {
    env.WELTENBUMMLERPAAR_BACKEND_JWT_SECRET = oldJwtSecret;
  });
});
