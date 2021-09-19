import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { AdminDto } from './admins/dto/admin.dto';
import { AuthController, LoginRequest } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenDto } from './dto/access-token.dto';

describe('AuthControler', () => {
  let controller: AuthController;

  const mockJwt: AccessTokenDto = { accessToken: 'some JWT' };

  const mockService = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    login: async (adminDto: AdminDto): Promise<string> => mockJwt.accessToken,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    const loginSpy = jest.spyOn(mockService, 'login');

    const loginRequest: LoginRequest = {
      user: {
        id: new ObjectId().toHexString(),
        username: 'some username',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    let accessTokenDto: AccessTokenDto;

    beforeEach(async () => {
      accessTokenDto = await controller.login(loginRequest);
    });

    it('access token should have been returned', () => {
      expect(accessTokenDto).toEqual(mockJwt);
    });

    it('AuthService.login should have been called', () => {
      expect(loginSpy).toHaveBeenLastCalledWith(loginRequest.user);
    });
  });
});
