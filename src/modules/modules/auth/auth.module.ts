import { Module } from '@nestjs/common';
import { AuthService } from './application/services/auth.service';
import { FirebaseJwtStrategy } from './application/strategies/firebase-jwt.strategy';

@Module({
  providers: [AuthService, FirebaseJwtStrategy],
})
export class AuthModule {}
