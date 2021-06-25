import { IsString, IsUrl } from 'class-validator'

export class Config {
  @IsUrl({
    protocols: ['mongodb'],
    require_protocol: true,
    require_tld: false
  })
  WELTENBUMMLERPAAR_BACKEND_DATABASE_URI: string

  @IsString()
  WELTENBUMMLERPAAR_BACKEND_IMAGE_UPLOAD_DESTINATION: string
}
