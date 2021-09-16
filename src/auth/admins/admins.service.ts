import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schemas/admin.schema';
import { AdminModel } from './models/admin.model';
import { AdminLoginDto } from './dto/admin-login';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: AdminModel,
  ) {}

  async register(adminLoginDto: AdminLoginDto): Promise<Admin> {
    const { password, ...admin } = adminLoginDto;
    return await this.adminModel.register(admin, password);
  }

  async authenticate(adminLogin: AdminLoginDto): Promise<Admin> {
    const { username, password } = adminLogin;

    const result = await this.adminModel.authenticate()(username, password);

    if (result.user === false) {
      throw new UnauthorizedException(result.error);
    }

    return result.user;
  }
}
