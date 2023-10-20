import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user-dtos/user-credentials.dto';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/login')
  async signIn(@Body() user: UserDto): Promise<{ accessToken: string }> {
    return this.userService.signIn(user);
  }

  @Post('/check-token')
  async checkToken(@Body() tokenToVerify: string) {
    return this.userService.checkToken(tokenToVerify);
  }

  @Post('/test')
  testController(@Body() body) {
    console.log(body);
  }
}
