import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import corsConfig from './cors.config';

export interface CorsOptions {
  origin: string[] | boolean;
  methods: string[];
}

export interface Corp {
  policy: 'same-origin' | 'cross-origin';
}

export interface CorpOptions {
  crossOriginResourcePolicy: Corp;
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

  createCorpOptions(corsOptions: CorsOptions): CorpOptions {
    const policy = this.corsIsEnabled(corsOptions)
      ? 'cross-origin'
      : 'same-origin';

    return { crossOriginResourcePolicy: { policy } };
  }

  corsIsEnabled(corsOptions: CorsOptions): boolean {
    return corsOptions.origin !== false;
  }

  private get corsOrigins(): string[] | boolean {
    const origins = this.config.origins;
    return origins.length > 0 ? origins.split(',') : false;
  }
}
