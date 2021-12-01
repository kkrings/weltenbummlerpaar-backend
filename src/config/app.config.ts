import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.WELTENBUMMLERPAAR_BACKEND_APP_PORT,
  prefix: process.env.WELTENBUMMLERPAAR_BACKEND_APP_PREFIX,
}));
