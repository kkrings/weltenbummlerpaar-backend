import { mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { HttpsCerts, readHttpsCerts } from './https';

describe('readHttpsCerts', () => {
  let workDir: string;
  let cwdSpy: jest.SpyInstance;
  let certs: HttpsCerts;

  beforeAll(async () => {
    workDir = await mkdtemp(join(tmpdir(), 'weltenbummlerpaar-backend-'));
  });

  beforeAll(() => {
    cwdSpy = jest.spyOn(process, 'cwd').mockImplementation(() => workDir);
  });

  describe('cert and key not configured', () => {
    beforeAll(async () => {
      certs = await readHttpsCerts();
    });

    it('key should be undefined', () => {
      expect(certs.key).toBeUndefined();
    });

    it('cert should be undefined', () => {
      expect(certs.cert).toBeUndefined();
    });
  });

  describe('existing cert and key specified via .env', () => {
    let keyPath: string;
    let certPath: string;

    const key = 'This is a private key.';
    const cert = 'This is a public key.';

    beforeAll(() => {
      keyPath = join(workDir, 'weltenbummlerpaar_backend.key');
      certPath = join(workDir, 'weltenbummlerpaar_backend.cert');
    });

    beforeAll(async () => {
      await writeFile(keyPath, key);
      await writeFile(certPath, cert);
    });

    beforeAll(async () => {
      const env = [
        `WELTENBUMMLERPAAR_BACKEND_HTTPS_KEY = ${keyPath}`,
        `WELTENBUMMLERPAAR_BACKEND_HTTPS_CERT = ${certPath}`,
      ];

      await writeFile(join(workDir, '.env'), env.join('\n'));
    });

    beforeAll(async () => {
      certs = await readHttpsCerts();
    });

    it('key should have been read', () => {
      expect(certs.key).toEqual(Buffer.from(key));
    });

    it('cert should have been read', () => {
      expect(certs.cert).toEqual(Buffer.from(cert));
    });

    describe('overriden with non-existing cert and key via env', () => {
      let oldKeyPath: string;
      let oldCertPath: string;

      beforeAll(() => {
        const keyPath = join(workDir, 'some_other.key');
        oldKeyPath = process.env.WELTENBUMMLERPAAR_BACKEND_HTTPS_KEY;
        process.env.WELTENBUMMLERPAAR_BACKEND_HTTPS_KEY = keyPath;
      });

      beforeAll(() => {
        const certPath = join(workDir, 'some_other.cert');
        oldCertPath = process.env.WELTENBUMMLERPAAR_BACKEND_HTTPS_CERT;
        process.env.WELTENBUMMLERPAAR_BACKEND_HTTPS_CERT = certPath;
      });

      beforeAll(async () => {
        certs = await readHttpsCerts();
      });

      it('key should be undefined', () => {
        expect(certs.key).toBeUndefined();
      });

      it('cert should be undefined', () => {
        expect(certs.cert).toBeUndefined();
      });

      afterAll(() => {
        process.env.WELTENBUMMLERPAAR_BACKEND_HTTPS_KEY = oldKeyPath;
        process.env.WELTENBUMMLERPAAR_BACKEND_HTTPS_CERT = oldCertPath;
      });
    });
  });

  afterAll(() => {
    cwdSpy.mockReset();
  });

  afterAll(async () => {
    await rm(workDir, { recursive: true });
  });
});
