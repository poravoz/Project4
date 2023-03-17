import { Controller, Post, Body, HttpCode, Req, UseGuards, Res, Get, HttpException, HttpStatus } from '@nestjs/common';
import { LocalAuthGuard } from './localAuth.guard';
import { AuthService } from './auth.service';
import RequestWithUser from './interfaces/requestWithUser.interface';
import RegisterDto from './dto/register.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto, @Res() response: Response) {
    const { password, confirmPassword } = registrationData;
    const passwordsMatch = await this.authService.validatePassword(password, confirmPassword);

    if (!passwordsMatch) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    const createdUser = await this.authService.register(registrationData);
    createdUser.password = null;

    const cookie = this.authService.getCookieWithJwtToken(createdUser.id, createdUser.email, createdUser.name);
    response.setHeader('Set-Cookie', cookie);
    return response.send(createdUser);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser, @Res() response: Response) {
    const {user} = request;
    const cookie = this.authService.getCookieWithJwtToken(user.id, user.email, user.name);
    response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return response.send(user);
  }

  @Get('logout')
  async logout(@Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }


}
