import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { UserDto } from './user-signIn.dto';

@Injectable()
export class UserService {
  private admin: User = {
    id: '1',
    email: 'user@email.com',
    password: 'pass',
  };

  signIn(user: UserDto): void {
    const { email, password } = user;

    if (email === this.admin.email && password === this.admin.password) {
      console.log('success');
    } else {
      console.log('denied');
    }
  }
}
