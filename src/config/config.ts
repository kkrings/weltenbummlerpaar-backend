import { IsString, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';
import { transformCorsOrigins } from '../cors/cors-config.transform';

export class Config {
  @IsUrl({
    protocols: ['mongodb'],
    require_protocol: true,
    require_tld: false,
  })
  WELTENBUMMLERPAAR_BACKEND_DATABASE_URI: string;

  @IsString()
  WELTENBUMMLERPAAR_BACKEND_IMAGE_UPLOAD_DESTINATION: string;

  @IsString()
  WELTENBUMMLERPAAR_BACKEND_JWT_SECRET: string;

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

  @IsString()
  WELTENBUMMLERPAAR_BACKEND_STATIC_FILES_ROOT_PATH: string;
}
