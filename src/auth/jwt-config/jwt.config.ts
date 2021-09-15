import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.WELTENBUMMLERPAAR_BACKEND_JWT_SECRET,
}));
