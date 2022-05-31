import { isRequired } from './config';

describe('isRequired', () => {
  describe('existing env variable', () => {
    let envName: string;
    let envValue: string;
    let oldEnvValue: string | undefined;

    beforeEach(() => {
      envName = 'SOME_ENV_VARIABLE';
      envValue = 'some env value';
    });

    beforeEach(() => {
      oldEnvValue = process.env[envName];
      process.env[envName] = envValue;
    });

    it('should have returned env value', () => {
      expect(isRequired(envName)).toEqual(envValue);
    });

    afterEach(() => {
      process.env[envName] = oldEnvValue;
    });
  });

  describe('non-existing env variable', () => {
    let envName: string;
    let envValue: string | undefined;

    beforeEach(() => {
      envName = 'SOME_ENV_VARIABLE';
    });

    beforeEach(() => {
      envValue = process.env[envName];
      delete process.env[envName];
    });

    it('should have thrown error', () => {
      expect(() => isRequired(envName)).toThrow();
    });

    afterEach(() => {
      process.env[envName] = envValue;
    });
  });
});
