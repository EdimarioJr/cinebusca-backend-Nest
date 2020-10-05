import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './local.strategy'
import { JwtModule } from "@nestjs/jwt"
import { jwtConstant } from './auth.constants'


@Module({
    imports: [UserModule, PassportModule, JwtModule.register({
        secret: jwtConstant.secret,
        signOptions: { expiresIn: '60s' }
    })],
    providers: [AuthService, LocalStrategy],
    exports: [AuthService]
})

export class AuthModule { }