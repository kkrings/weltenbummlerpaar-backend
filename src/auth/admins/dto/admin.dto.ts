import { Admin } from '../schemas/admin.schema';

export class AdminDto {
  /**
   * Admin user's unique identifier
   * @example '6145884600d86fe4d755a455'
   */
  id: string;

  /**
   * Admin user's login name
   */
  username: string;

  /**
   * Date-time the admin user was created.
   */
  createdAt: Date;

  /**
   * Date-time the admin user was last modified.
   */
  updatedAt: Date;
}

export const asAdminDto = (admin: Admin): AdminDto => ({
  id: admin._id.toHexString(),
  username: admin.username,
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});
