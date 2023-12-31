import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.model';
import { UserDto } from './user-dtos/user-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './user-dtos/jwt-payload.interface';
import { readDataFromFile, writeDataToFile } from 'src/data/readWriteData';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private static admin: User = {
    id: '1',
    email: 'user@email.com',
    password: 'pass',
  };

  constructor(private jwtService: JwtService) {
    writeDataToFile<User>('users', []);
    UserService.createAdmin();
  }

  //Creating a more secure password and storing it in the file
  private static async createAdmin() {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(this.admin.password, salt);

    this.admin.password = hashedPassword;
    const data: User[] = await readDataFromFile('users');
    data.push(this.admin);

    writeDataToFile<User>('users', data);
  }

  async signIn(user: UserDto): Promise<{ accessToken: string }> {
    const { email, password } = user;

    const usersFromFile = await readDataFromFile<User>('users');

    const theAdmin = usersFromFile[0];
    if (
      email === theAdmin.email &&
      (await bcrypt.compare(password, theAdmin.password))
    ) {
      const payload: JwtPayload = { email };

      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }

  async checkToken(tokenToVerify: { accessToken: string }): Promise<boolean> {
    try {
      await this.jwtService.verify(tokenToVerify.accessToken);
      return true;
    } catch (error) {
      return false;
    }
  }
}
