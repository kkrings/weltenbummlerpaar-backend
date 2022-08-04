import { FileTypeValidator, HttpStatus, ParseFilePipe } from '@nestjs/common';

export function imageUploadValidation(uploadIsRequired = true): ParseFilePipe {
  return new ParseFilePipe({
    validators: uploadValidators,
    errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    fileIsRequired: uploadIsRequired,
  });
}

const uploadValidators = [new FileTypeValidator({ fileType: 'jpeg' })];
