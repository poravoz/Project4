import {Param, ParseIntPipe } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { DriverService } from '../driver/driver.service';


export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly driverService: DriverService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'test'
        });
    }

    async validate(): Promise<any> {
        return 'success';
    }

/*
  async validate(@Param('id', ParseIntPipe) id: number) {

    return this.driverService.getDriverById(id);
  }
  */
}