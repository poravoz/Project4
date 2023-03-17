import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { VehicleModule } from './vehicle/vehicle.module';
import { VehicleController } from './vehicle/vehicle.controller';
import { VehicleService } from './vehicle/vehicle.service';

import { DriverModule } from './driver/driver.module'
import { DriverController } from './driver/driver.controller';
import { DriverService} from './driver/driver.service';

import { ResponseModule } from './response/response.module'
import { ResponseController } from './response/response.controller'
import { ResponseService } from './response/response.service'
import { ConfigModule } from '@nestjs/config';
import * as Joi from "joi";

import { DatabaseModule } from 'src/database/database.module';

import { UserModule } from './user/user.module';
import { AuthModule} from './auth/auth.module';


@Module({
  imports: [VehicleModule, DriverModule, ResponseModule,ConfigModule.forRoot({
    validationSchema: Joi.object({
      POSTGRES_HOST: Joi.string().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRATION_TIME: Joi.string().required(),
      PORT: Joi.number(),
    })
  }),
  DatabaseModule,
  UserModule,
  AuthModule,
  DriverModule,
  ResponseModule,
  VehicleModule,
],
  controllers: [AppController, VehicleController, DriverController, ResponseController],
  providers: [AppService, DriverService, VehicleService, ResponseService],
})
export class AppModule {}
