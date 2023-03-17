import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import  PostgresErrorCode  from '../database/postgresErrorCode.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import TokenPayload from './interfaces/tokenPayload.interface';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
    ) {}

    public async register(registrationData: RegisterDto) {
      const { password, confirmPassword } = registrationData;
      const passwordsMatch = await this.validatePassword(password, confirmPassword);
    
      if (!passwordsMatch) {
        throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
      }
    
      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        const newUser = {
          ...registrationData,
          password: hashedPassword
        };
        const createdUser = await this.userService.create(newUser);
        createdUser.password = null;
        return createdUser;
      } catch (error) {
        if (error?.code === PostgresErrorCode.UniqueViolation) {
          throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
        }
        throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }


public async getAuthUser(email: string, plainTextPassword: string) {
  try {
    const user = await this.userService.getByEmail(email);
    await this.verifyPassword(plainTextPassword, user.password);
    user.password = null;
    return user;
  } catch (error) {
    throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
  }
}
 
private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
  const isPasswordMatching = await bcrypt.compare(
    plainTextPassword,
    hashedPassword
  );
  if (!isPasswordMatching) {
    throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
  }
}

public async validatePassword(password: string, confirmPassword: string): Promise<boolean> {
  return password === confirmPassword;
}

public getCookieWithJwtToken(userId: number, email: string, name: string) {
  const payload: TokenPayload = { userId, email, name };
  const token = this.jwtService.sign(payload);
  return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
}

getCookieForLogOut() {
  return 'Authentication=; HttpOnly; Path=/; Max-Age=0';
}


}
