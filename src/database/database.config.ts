import { registerAs } from '@nestjs/config';

const transformAutoIndex = () =>
  process.env.WELTENBUMMLERPAAR_BACKEND_DATABASE_AUTO_INDEX === 'true'
    ? true
    : false;

export default registerAs('database', () => ({
  uri: process.env.WELTENBUMMLERPAAR_BACKEND_DATABASE_URI,
  options: {
    autoIndex: transformAutoIndex(),
  },
}));
