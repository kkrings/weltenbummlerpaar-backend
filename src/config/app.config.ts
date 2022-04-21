import { registerAs } from '@nestjs/config';
import { isRequired } from './config';

export default registerAs('app', () => ({
  port: isRequired('WELTENBUMMLERPAAR_BACKEND_APP_PORT'),
  prefix: process.env.WELTENBUMMLERPAAR_BACKEND_APP_PREFIX,
}));
