import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './user-dtos/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey: 'topSecretPasswordLetsgo',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  //overrites the default one / what we want to do after the token is valid
  validate(payload: JwtPayload) {
    const { email } = payload;

    if (email !== 'user@email.com') {
      throw new UnauthorizedException();
    }

    return email;
  }
}
