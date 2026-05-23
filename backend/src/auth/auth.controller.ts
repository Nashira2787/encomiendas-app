import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

interface LoginDto {
  nombreUsuario: string;
  password: string;
}

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombreUsuario: { type: 'string', example: 'admin' },
        password: { type: 'string', example: '123' }
      }
    }
  })
  login(@Body() body: LoginDto) {
    return this.authService.login(body.nombreUsuario, body.password);
  }
}