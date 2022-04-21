import { registerAs } from '@nestjs/config';
import { isRequired } from '../../config/config';

export default registerAs('jwt', () => ({
  secret: isRequired('WELTENBUMMLERPAAR_BACKEND_JWT_SECRET'),
}));
