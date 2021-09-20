import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from '../interfaces/payload.interface';
import {
  AdminFromJwtDto,
  asAdminFromJwtDto,
} from '../admins/dto/admin-from-jwt.dto';
import { JwtConfigService } from '../jwt-config/jwt-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(jwtConfigService: JwtConfigService) {
    super({
      secretOrKey: jwtConfigService.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload): Promise<AdminFromJwtDto> {
    return asAdminFromJwtDto(payload);
  }
}
