import { OmitType } from '@nestjs/swagger';
import { AdminDto } from './admin.dto';

export class AdminLoginDto extends OmitType(AdminDto, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {
  password: string;
}
