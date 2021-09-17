import { Admin } from '../schemas/admin.schema';

export class AdminDto {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export const asAdminDto = (admin: Admin): AdminDto => ({
  id: admin._id.toHexString(),
  username: admin.username,
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});
