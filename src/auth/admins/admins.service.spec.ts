import { UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { AdminsService } from './admins.service';
import { AdminLoginDto } from './dto/admin-login';
import {
  AuthenticationMethod,
  AuthenticationResult,
} from './models/admin.model';
import { Admin } from './schemas/admin.schema';

class AdminModelMock {
  admin: Admin = {
    _id: new ObjectId(),
    username: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async register(user: { username: string }, password: string): Promise<Admin> {
    return { ...this.admin, username: user.username };
  }

  authenticate(): AuthenticationMethod {
    return async (username, password) =>
      await this.getAdmin(username, password);
  }

  async getAdmin(
    username: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    password: string,
  ): Promise<AuthenticationResult> {
    return { user: { ...this.admin, username } };
  }
}

describe('AdminsService', () => {
  const mockModel = new AdminModelMock();

  const adminLoginDto: AdminLoginDto = {
    username: 'some username',
    password: 'some password',
  };

  let service: AdminsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Admin.name),
          useValue: mockModel,
        },
        AdminsService,
      ],
    }).compile();

    service = module.get<AdminsService>(AdminsService);
  });

  describe('register', () => {
    const registerSpy = jest.spyOn(mockModel, 'register');

    let admin: Admin;

    beforeEach(async () => {
      admin = await service.register(adminLoginDto);
    });

    it('admin should have been returned', () => {
      const expectedAdmin: Admin = {
        ...mockModel.admin,
        username: adminLoginDto.username,
      };

      expect(admin).toEqual(expectedAdmin);
    });

    it('AdminModel.register should have been called', () => {
      expect(registerSpy).toHaveBeenCalledWith(
        { username: adminLoginDto.username },
        adminLoginDto.password,
      );
    });
  });

  describe('authenticate', () => {
    const getAdminSpy = jest.spyOn(mockModel, 'getAdmin');

    describe('on successful authentication', () => {
      let admin: Admin;

      beforeEach(async () => {
        admin = await service.authenticate(adminLoginDto);
      });

      it('admin should have been returned', () => {
        const expectedAdmin: Admin = {
          ...mockModel.admin,
          username: adminLoginDto.username,
        };

        expect(admin).toEqual(expectedAdmin);
      });

      it('AdminModel.authenticate should have been called', () => {
        expect(getAdminSpy).toHaveBeenLastCalledWith(
          adminLoginDto.username,
          adminLoginDto.password,
        );
      });
    });

    describe('on failed authentication', () => {
      const error = new Error('some error message');

      let adminPromise: Promise<Admin>;

      beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getAdminSpy.mockImplementationOnce(async (username, password) => ({
          user: false,
          error,
        }));
      });

      beforeEach(() => {
        adminPromise = service.authenticate(adminLoginDto);
      });

      it('unauthorized exception should have been thrown', async () => {
        await expect(adminPromise).rejects.toEqual(
          new UnauthorizedException(error),
        );
      });

      it('AdminModel.authenticate should have been called', async () => {
        try {
          await adminPromise;
        } catch {
          // do nothing
        }

        expect(getAdminSpy).toHaveBeenLastCalledWith(
          adminLoginDto.username,
          adminLoginDto.password,
        );
      });
    });
  });
});
