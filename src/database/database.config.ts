import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.WELTENBUMMLERPAAR_BACKEND_DATABASE_URI,
  options: {
    useCreateIndex: true,
    useFindAndModify: false,
  },
}));
