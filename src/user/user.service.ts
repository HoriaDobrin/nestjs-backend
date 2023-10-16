import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.model';
import { UserDto } from './user-dtos/user-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './user-dtos/jwt-payload.interface';
import { readDataFromFile } from 'src/data/readWriteData';

@Injectable()
export class UserService {
  private admin: User = {
    id: '1',
    email: 'user@email.com',
    password: 'pass',
  };

  constructor(private jwtService: JwtService) {}

  async signIn(user: UserDto): Promise<{ accessToken: string }> {
    const { email, password } = user;

    const usersFromFile = await readDataFromFile<User>('users');

    const theAdmin = usersFromFile[0];

    if (email === theAdmin.email && password === theAdmin.password) {
      const payload: JwtPayload = { email };

      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }
}
