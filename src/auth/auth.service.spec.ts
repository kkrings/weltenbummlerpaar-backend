import { Test, TestingModule } from '@nestjs/testing';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import { Admin } from './admins/schemas/admin.schema';
import { AdminDto } from './admins/dto/admin.dto';
import { AdminLoginDto } from './admins/dto/admin-login.dto';
import { AdminsService } from './admins/admins.service';
import { AuthService } from './auth.service';

class AdminsServiceMock {
  admin: Admin = {
    _id: new ObjectId(),
    username: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  async authenticate(adminLoginDto: AdminLoginDto): Promise<Admin> {
    return { ...this.admin, username: adminLoginDto.username };
  }
}

class JwtServiceMock {
  jwtMock = 'some JWT';

  async signAsync(
    /* eslint-disable @typescript-eslint/no-unused-vars */
    // eslint-disable-next-line @typescript-eslint/ban-types
    payload: string | object | Buffer,
    options?: JwtSignOptions,
    /* eslint-enable @typescript-eslint/no-unused-vars */
  ): Promise<string> {
    return this.jwtMock;
  }
}

describe('AuthService', () => {
  let service: AuthService;

  const mockAdminsService = new AdminsServiceMock();
  const mockJwtService = new JwtServiceMock();

  const adminLoginDto: AdminLoginDto = {
    username: mockAdminsService.admin.username,
    password: 'some password',
  };

  const adminDto: AdminDto = {
    id: mockAdminsService.admin._id.toHexString(),
    username: adminLoginDto.username,
    createdAt: mockAdminsService.admin.createdAt,
    updatedAt: mockAdminsService.admin.updatedAt,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AdminsService,
          useValue: mockAdminsService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateAdmin', () => {
    const authenticateSpy = jest.spyOn(mockAdminsService, 'authenticate');

    let admin: Admin;

    beforeEach(async () => {
      const { username, password } = adminLoginDto;
      admin = await service.validateAdmin(username, password);
    });

    it('admin should have been returned', async () => {
      expect(admin).toEqual(
        await mockAdminsService.authenticate(adminLoginDto),
      );
    });

    it('AdminsService.authenticate should have been called', () => {
      expect(authenticateSpy).toHaveBeenLastCalledWith(adminLoginDto);
    });
  });

  describe('login', () => {
    const signAsyncSpy = jest.spyOn(mockJwtService, 'signAsync');

    let accessToken: string;

    beforeEach(async () => {
      accessToken = await service.login(adminDto);
    });

    it('access token should have been returned', () => {
      expect(accessToken).toEqual(mockJwtService.jwtMock);
    });

    it('JwtService.signAsync should have been called', () => {
      expect(signAsyncSpy).toHaveBeenLastCalledWith({
        username: adminDto.username,
        sub: adminDto.id,
      });
    });
  });
});
