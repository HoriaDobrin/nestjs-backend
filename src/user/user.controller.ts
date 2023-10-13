import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user-signIn.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/login')
  signIn(@Body() user: UserDto): void {
    return this.userService.signIn(user);
  }
}
