import { Injectable } from '@nestjs/common';
import { AdminsService } from './admins/admins.service';
import { Admin } from './admins/schemas/admin.schema';

@Injectable()
export class AuthService {
  constructor(private readonly adminsService: AdminsService) {}

  async validateAdmin(username: string, password: string): Promise<Admin> {
    return await this.adminsService.authenticate({ username, password });
  }
}
