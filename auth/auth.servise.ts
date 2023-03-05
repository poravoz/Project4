import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthServise {
    constructor(private jwtService: JwtService) { }

    async login(user: any): Promise<any> {
        return {
            access_token: this.jwtService.sign({
                user: user, sub: 1
            })
        }
    }
}