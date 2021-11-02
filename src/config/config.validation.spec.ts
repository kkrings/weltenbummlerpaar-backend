import 'reflect-metadata';
import { Config } from './config';
import { validateConfig } from './config.validation';

describe('validateConfig', () => {
  const databaseUri = 'mongodb://localhost:27017/weltenbummlerpaar';
  const imageUploadDestination = './public';
  const jwtSecret = 'some secret';
  const corsOrigins = ['http://localhost:4200'];
  const staticFilesRootPath = '/workspace/public';

  const config: Record<string, string> = {
    WELTENBUMMLERPAAR_BACKEND_DATABASE_URI: databaseUri,
    WELTENBUMMLERPAAR_BACKEND_IMAGE_UPLOAD_DESTINATION: imageUploadDestination,
    WELTENBUMMLERPAAR_BACKEND_JWT_SECRET: jwtSecret,
    WELTENBUMMLERPAAR_BACKEND_CORS_ORIGINS: JSON.stringify(corsOrigins),
    WELTENBUMMLERPAAR_BACKEND_STATIC_FILES_ROOT_PATH: staticFilesRootPath,
  };

  const validatedConfig: Config = {
    WELTENBUMMLERPAAR_BACKEND_DATABASE_URI: databaseUri,
    WELTENBUMMLERPAAR_BACKEND_IMAGE_UPLOAD_DESTINATION: imageUploadDestination,
    WELTENBUMMLERPAAR_BACKEND_JWT_SECRET: jwtSecret,
    WELTENBUMMLERPAAR_BACKEND_CORS_ORIGINS: corsOrigins,
    WELTENBUMMLERPAAR_BACKEND_STATIC_FILES_ROOT_PATH: staticFilesRootPath,
  };

  it('validated config should have been returned', () => {
    expect(validateConfig(config)).toEqual(validatedConfig);
  });

  describe('database URI', () => {
    it('error should have been thrown if missing', () => {
      const configCopy: Record<string, string> = { ...config };
      delete configCopy.WELTENBUMMLERPAAR_BACKEND_DATABASE_URI;
      expect(() => validateConfig(configCopy)).toThrow();
    });

    it('error should have been thrown if protocol is missing', () => {
      const uri = 'localhost:27017/weltenbummlerpaar';

      const configCopy: Record<string, string> = {
        ...config,
        WELTENBUMMLERPAAR_BACKEND_DATABASE_URI: uri,
      };

      expect(() => validateConfig(configCopy)).toThrow();
    });
  });

  describe('image upload destination', () => {
    it('error should have been thrown if missing', () => {
      const configCopy: Record<string, string> = { ...config };
      delete configCopy.WELTENBUMMLERPAAR_BACKEND_IMAGE_UPLOAD_DESTINATION;
      expect(() => validateConfig(configCopy)).toThrow();
    });
  });

  describe('JWT secret', () => {
    it('error should have been thrown if missing', () => {
      const configCopy: Record<string, string> = { ...config };
      delete configCopy.WELTENBUMMLERPAAR_BACKEND_JWT_SECRET;
      expect(() => validateConfig(configCopy)).toThrow();
    });
  });

  describe('CORS origins', () => {
    it('empty CORS origins array should pass validation', () => {
      const configCopy: Record<string, string> = {
        ...config,
        WELTENBUMMLERPAAR_BACKEND_CORS_ORIGINS: '[]',
      };
      const validatedConfig = validateConfig(configCopy);
      expect(validatedConfig.WELTENBUMMLERPAAR_BACKEND_CORS_ORIGINS).toEqual(
        [],
      );
    });

    it('error should have been thrown if missing', () => {
      const configCopy: Record<string, string> = { ...config };
      delete configCopy.WELTENBUMMLERPAAR_BACKEND_CORS_ORIGINS;
      expect(() => validateConfig(configCopy)).toThrow();
    });

    it('error should have been thrown if not valid JSON', () => {
      const origins = 'This is no valid JSON.';

      const configCopy: Record<string, string> = {
        ...config,
        WELTENBUMMLERPAAR_BACKEND_CORS_ORIGINS: origins,
      };

      expect(() => validateConfig(configCopy)).toThrow();
    });

    it('error should have been thrown if protocol is missing', () => {
      const origins = '["localhost:4200"]';

      const configCopy: Record<string, string> = {
        ...config,
        WELTENBUMMLERPAAR_BACKEND_CORS_ORIGINS: origins,
      };

      expect(() => validateConfig(configCopy)).toThrow();
    });
  });

  describe('static files root path', () => {
    it('error should have been thrown if missing', () => {
      const configCopy: Record<string, string> = { ...config };
      delete configCopy.WELTENBUMMLERPAAR_BACKEND_STATIC_FILES_ROOT_PATH;
      expect(() => validateConfig(configCopy)).toThrow();
    });
  });
});
