import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthServise } from "./auth.servise";
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./localstrategy";


@Module({
    imports: [PassportModule, JwtModule.register({
        secret: 'test',
        signOptions: {expiresIn: '360s'}
    })],
    providers: [AuthServise, LocalStrategy, JwtStrategy],
    exports: [AuthServise]
}) 
export class AuthModule {

}