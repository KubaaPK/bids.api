import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AuthService } from '../services/auth.service';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      ignoreExpiration: false,
    });
  }

  public async validate(token: string): Promise<admin.auth.DecodedIdToken> {
    return await this.authService.validate(token);
  }
}
