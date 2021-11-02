import { registerAs } from '@nestjs/config';

export default registerAs('static-files', () => ({
  rootPath: process.env.WELTENBUMMLERPAAR_BACKEND_STATIC_FILES_ROOT_PATH,
}));
