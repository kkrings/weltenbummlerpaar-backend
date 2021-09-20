import { OmitType } from '@nestjs/swagger';
import { Payload } from '../../interfaces/payload.interface';
import { AdminDto } from './admin.dto';

export class AdminFromJwtDto extends OmitType(AdminDto, [
  'createdAt',
  'updatedAt',
] as const) {}

export const asAdminFromJwtDto = (payload: Payload): AdminFromJwtDto => ({
  id: payload.sub,
  username: payload.username,
});
