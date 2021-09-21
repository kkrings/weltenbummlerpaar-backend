import 'reflect-metadata';
import { Config } from './config';
import { validateConfig } from './config.validation';

describe('validateConfig', () => {
  const databaseUri = 'mongodb://localhost:27017/weltenbummlerpaar';
  const imageUploadDestination = './public';
  const jwtSecret = 'some secret';

  const config: Record<string, string> = {
    WELTENBUMMLERPAAR_BACKEND_DATABASE_URI: databaseUri,
    WELTENBUMMLERPAAR_BACKEND_IMAGE_UPLOAD_DESTINATION: imageUploadDestination,
    WELTENBUMMLERPAAR_BACKEND_JWT_SECRET: jwtSecret,
  };

  const validatedConfig: Config = {
    WELTENBUMMLERPAAR_BACKEND_DATABASE_URI: databaseUri,
    WELTENBUMMLERPAAR_BACKEND_IMAGE_UPLOAD_DESTINATION: imageUploadDestination,
    WELTENBUMMLERPAAR_BACKEND_JWT_SECRET: jwtSecret,
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
});
