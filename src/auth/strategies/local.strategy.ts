
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // mudando a assinatura do metodo. ao inves de receber username, recebe name. Ou seja
    // o front end tem que mandar "name" como parametro
    super({ usernameField: "name" });
  }
  // A assinatura do metodo validate tem que ser exatamente essa: (name,password)
  async validate(name: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(name, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}