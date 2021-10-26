import { registerAs } from '@nestjs/config';

export default registerAs('cors', () => ({
  origins: process.env.WELTENBUMMLERPAAR_BACKEND_CORS_ORIGINS,
  methods: ['DELETE', 'GET', 'PATCH', 'POST'],
}));
