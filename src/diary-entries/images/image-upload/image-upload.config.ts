import { registerAs } from '@nestjs/config';

export interface ImageManipulationConfig {
  imageWidth: number;
  imageQuality: number;
}

export interface ImageUploadConfig {
  destination: string;
  manipulation: ImageManipulationConfig;
}

export default registerAs(
  'imageUpload',
  (): ImageUploadConfig => ({
    destination: process.env.WELTENBUMMLERPAAR_BACKEND_IMAGE_UPLOAD_DESTINATION,
    manipulation: { imageWidth: 2500, imageQuality: 75 },
  }),
);
