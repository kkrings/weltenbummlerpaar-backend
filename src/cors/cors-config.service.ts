import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import corsConfig from './cors.config';

export interface CorsOptions {
  origin: string[] | boolean;
  methods: string[];
}

@Injectable()
export class CorsConfigService {
  constructor(
    @Inject(corsConfig.KEY)
    private readonly config: ConfigType<typeof corsConfig>,
  ) {}

  createCorsOptions(): CorsOptions {
    return { origin: this.corsOrigins, methods: this.config.methods };
  }

  private get corsOrigins(): string[] | boolean {
    const origins = this.config.origins;
    return origins.length > 0 ? origins.split(',') : false;
  }
}
