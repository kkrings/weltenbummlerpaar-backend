import {
  Controller,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminLoginDto } from './admins/dto/admin-login.dto';
import { AdminDto } from './admins/dto/admin.dto';
import { AuthService } from './auth.service';
import { AccessTokenDto } from './dto/access-token.dto';
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication failed',
  })
  async login(@Request() request: LoginRequest): Promise<AccessTokenDto> {
    return { accessToken: await this.authService.login(request.user) };
  }
}
