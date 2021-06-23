import { registerAs } from '@nestjs/config'

export default registerAs('imageUpload', () => ({
  destination: process.env.WELTENBUMMLERPAAR_BACKEND_IMAGE_UPLOAD_DESTINATION
}))
