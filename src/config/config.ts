import {
  IsBooleanString,
  IsOptional,
  IsPort,
  IsString,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { transformCorsOrigins } from '../cors/cors-config.transform';

export class Config {
  @IsPort()
  WELTENBUMMLERPAAR_BACKEND_APP_PORT: string;

  @IsOptional()
  @IsString()
  WELTENBUMMLERPAAR_BACKEND_APP_PREFIX?: string;

  @Transform(({ value }) => transformCorsOrigins(value))
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_tld: false,
    },
    { each: true },
  )
  WELTENBUMMLERPAAR_BACKEND_CORS_ORIGINS: string[];

  @IsUrl({
    protocols: ['mongodb'],
    require_protocol: true,
    require_tld: false,
  })
  WELTENBUMMLERPAAR_BACKEND_DATABASE_URI: string;

  @IsBooleanString()
  WELTENBUMMLERPAAR_BACKEND_DATABASE_AUTO_INDEX: string;

  @IsOptional()
  @IsString()
  WELTENBUMMLERPAAR_BACKEND_HTTPS_CERT?: string;

  @IsOptional()
  @IsString()
  WELTENBUMMLERPAAR_BACKEND_HTTPS_KEY?: string;

  @IsString()
  WELTENBUMMLERPAAR_BACKEND_IMAGE_UPLOAD_DESTINATION: string;

  @IsString()
  WELTENBUMMLERPAAR_BACKEND_JWT_SECRET: string;

  @IsOptional()
  @IsString()
  WELTENBUMMLERPAAR_BACKEND_STATIC_FILES_ROOT_PATH?: string;
}

export class IsRequiredError extends Error {
  constructor(name: string) {
    super(`Environment variable '${name}' needs to be defined.`);
  }
}

export const isRequired = (name: string): string => {
  const value = process.env[name];

  if (value === undefined) {
    throw new IsRequiredError(name);
  }

  return value;
};
