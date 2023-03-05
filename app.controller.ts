import { Controller, Get, Post, Req, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';;
import { AuthServise } from './auth/auth.servise';
import { DriverService } from './driver/driver.service';

@Controller('api')

export class AppController {
  constructor( private authService: AuthServise, private readonly driverService: DriverService) {}

  /*
  @Get('driver/:id')
  async data(@Param('id', ParseIntPipe) id: number) {

    return this.driverService.getDriverById(id);
  }
  */

  @Get('driver')
  async data() {
    return 'success'
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))



  getHello() {
    return "Hello";
  }
  
}

