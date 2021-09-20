import { Test, TestingModule } from '@nestjs/testing';
import { AdminFromJwtDto } from '../admins/dto/admin-from-jwt.dto';
import { JwtConfigService } from '../jwt-config/jwt-config.service';
import { Payload } from '../interfaces/payload.interface';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  const jwtConfigServiceMock = { jwtSecret: 'some JWT secret' };

  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JwtConfigService,
          useValue: jwtConfigServiceMock,
        },
        JwtStrategy,
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    const payload: Payload = { username: 'some username', sub: 'some ID' };

    let adminFromJwtDto: AdminFromJwtDto;

    beforeEach(async () => {
      adminFromJwtDto = await strategy.validate(payload);
    });

    it('admin should have been returned', () => {
      expect(adminFromJwtDto).toEqual({
        id: payload.sub,
        username: payload.username,
      });
    });
  });
});
