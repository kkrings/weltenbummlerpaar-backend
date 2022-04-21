import { registerAs } from '@nestjs/config';
import { isRequired } from 'src/config/config';

export interface ImageManipulationConfig {
  imageWidth: number;
  imageQuality: number;
}

export interface ImageUploadConfig {
  destination: string;
  manipulation: ImageManipulationConfig;
}

const getImageUploadDestination = () =>
  isRequired('WELTENBUMMLERPAAR_BACKEND_IMAGE_UPLOAD_DESTINATION');

export default registerAs(
  'imageUpload',
  (): ImageUploadConfig => ({
    destination: getImageUploadDestination(),
    manipulation: { imageWidth: 2500, imageQuality: 75 },
  }),
);
