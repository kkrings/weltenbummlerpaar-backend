import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { AdminDto } from '../admins/dto/admin.dto';
import { Admin } from '../admins/schemas/admin.schema';
import { AuthService } from '../auth.service';
import { LocalStrategy } from './local.strategy';

class AuthServiceMock {
  admin: Admin = {
    _id: new ObjectId(),
    username: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validateAdmin(username: string, password: string): Promise<Admin> {
    return { ...this.admin, username };
  }
}

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;

  const mockService = new AuthServiceMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: AuthService, useValue: mockService },
        LocalStrategy,
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
  });

  describe('validate', () => {
    const validateAdminSpy = jest.spyOn(mockService, 'validateAdmin');

    const username = 'some username';
    const password = 'some password';

    let adminDto: AdminDto;

    beforeEach(async () => {
      adminDto = await strategy.validate(username, password);
    });

    it('admin should have been returned', () => {
      expect(adminDto).toEqual({
        id: mockService.admin._id.toHexString(),
        username: username,
        createdAt: mockService.admin.createdAt,
        updatedAt: mockService.admin.updatedAt,
      });
    });

    it('AuthService.validateAdmin should have been called', () => {
      expect(validateAdminSpy).toHaveBeenLastCalledWith(username, password);
    });
  });
});
