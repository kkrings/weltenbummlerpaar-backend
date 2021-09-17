import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminsService } from './admins/admins.service';
import { AdminDto } from './admins/dto/admin.dto';
import { Admin } from './admins/schemas/admin.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly jwtService: JwtService,
  ) {}

  async validateAdmin(username: string, password: string): Promise<Admin> {
    return await this.adminsService.authenticate({ username, password });
  }

  async login(adminDto: AdminDto): Promise<string> {
    return await this.jwtService.signAsync({
      username: adminDto.username,
      sub: adminDto.id,
    });
  }
}
