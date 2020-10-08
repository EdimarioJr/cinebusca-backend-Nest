
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import {JwtModule} from "@nestjs/jwt"
import {jwtConstants} from "./auth.constants"
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [forwardRef(()=> UserModule), PassportModule, 
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: {
      expiresIn: "5000s"
    }
  })],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}