import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { parse } from 'dotenv';

const readDotEnvFile = async (): Promise<Record<string, string>> => {
  let dotEnvFile: Record<string, string>;
  try {
    dotEnvFile = { ...parse(await readFile(resolve(process.cwd(), '.env'))) };
  } catch {
    dotEnvFile = {};
  }

  return dotEnvFile;
};

const readCertFile = async (filePath?: string): Promise<Buffer | undefined> => {
  if (!filePath) {
    return undefined;
  }

  let certFile: Buffer | undefined;
  try {
    certFile = await readFile(filePath);
  } catch {
    certFile = undefined;
  }

  return certFile;
};

export interface HttpsCerts {
  key?: Buffer;
  cert?: Buffer;
}

export const readHttpsCerts = async (): Promise<HttpsCerts> => {
  const env = {
    ...(await readDotEnvFile()),
    ...process.env,
  };

  return {
    key: await readCertFile(env.WELTENBUMMLERPAAR_BACKEND_HTTPS_KEY),
    cert: await readCertFile(env.WELTENBUMMLERPAAR_BACKEND_HTTPS_CERT),
  };
};
