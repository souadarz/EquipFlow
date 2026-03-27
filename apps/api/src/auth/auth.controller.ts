import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { AuthUser } from '@repo/shared';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    const { access_token } = await this.authService.login(
      user as typeof user & { _id: string },
    );

    res.cookie('token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined,
      maxAge: 1000 * 60 * 60 * 2,
    });

    return { user };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined,
    });
    return { message: 'Déconnecté' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: AuthUser) {
    return this.authService.getProfile(user.id);
  }
}
