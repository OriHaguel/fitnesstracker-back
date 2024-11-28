import { Controller, Post, Body, Res, UnauthorizedException, UseGuards, Get, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { JwtAuthGuard } from './guards/jwt-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() loginDto: { gmail: string; password: string }, @Res({ passthrough: true }) response: Response) {
    const user = await this.authService.validateUser(loginDto.gmail, loginDto.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user, response);
  }



  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
    return this.authService.signup(createUserDto, response);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile() {
    return { message: 'Protected route' };
  }


  @Get('user')
  async getLoggedInUser(@Req() request: Request) {
    const result = await this.authService.getLoggedInUser(request);
    return result;
  }
}