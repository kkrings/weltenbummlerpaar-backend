import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminFromJwtDto } from '../admins/dto/admin-from-jwt.dto';
import { JwtConfigService } from '../jwt-config/jwt-config.service';

export interface Payload {
  username: string;
  sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly jwtConfigService: JwtConfigService) {
    super({
      secretOrKey: jwtConfigService.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload): Promise<AdminFromJwtDto> {
    return { id: payload.sub, username: payload.username };
  }
}
