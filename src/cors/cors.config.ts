import { registerAs } from '@nestjs/config';
import { isRequired } from '../config/config';

export default registerAs('cors', () => ({
  origins: isRequired('WELTENBUMMLERPAAR_BACKEND_CORS_ORIGINS'),
  methods: ['DELETE', 'GET', 'PATCH', 'POST'],
}));
