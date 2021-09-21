import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AdminLoginDto } from './admins/dto/admin-login.dto';
import { AdminDto } from './admins/dto/admin.dto';
import { AuthService } from './auth.service';
import { AccessTokenDto, asAccessTokenDto } from './dto/access-token.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

export interface LoginRequest {
  user: AdminDto;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: AdminLoginDto })
  @ApiUnauthorizedResponse({ description: 'Authentication failed' })
  async login(@Request() request: LoginRequest): Promise<AccessTokenDto> {
    return asAccessTokenDto(await this.authService.login(request.user));
  }
}
