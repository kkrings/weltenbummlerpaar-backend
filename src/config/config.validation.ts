import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Config } from './config';

export function validateConfig(config: Record<string, unknown>): Config {
  const validatedConfig = plainToClass(Config, config, {
    enableImplicitConversion: true,
  });

  const validationErrors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (validationErrors.length > 0) {
    throw new Error(validationErrors.toString());
  }

  return validatedConfig;
}
