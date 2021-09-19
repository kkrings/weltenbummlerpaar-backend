import { OmitType } from '@nestjs/swagger';
import { AdminDto } from './admin.dto';

export class AdminFromJwtDto extends OmitType(AdminDto, [
  'createdAt',
  'updatedAt',
] as const) {}
