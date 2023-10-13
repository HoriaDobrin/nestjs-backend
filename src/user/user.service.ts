import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.model';
import { UserDto } from './user-dtos/user-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './user-dtos/jwt-payload.interface';

@Injectable()
export class UserService {
  private admin: User = {
    id: '1',
    email: 'user@email.com',
    password: 'pass',
  };

  constructor(private jwtService: JwtService) {}

  signIn(user: UserDto): { accessToken: string } {
    const { email, password } = user;

    if (email === this.admin.email && password === this.admin.password) {
      const payload: JwtPayload = { email };
      console.log(payload);

      const accessToken = this.jwtService.sign(payload);
      console.log(accessToken);
      return { accessToken };
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }
}
