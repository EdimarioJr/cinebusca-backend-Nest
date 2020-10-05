import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AuthService } from './auth.service'


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();    
    }
    // Implementando a estratégia local do Passport.Para cada estratégia, o método validate vai exigir
    // diferentes parâmetros. O método validate é similar em todas as estratégias. Se o usuário é 
    // encontrado e suas credenciais são válidas, o usuário é retornado para que o Passport termine suas
    // tarefas;
    async validate(name: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(name, password)
        if (!user)
            return "Usuário não validado!"
        return user
    }
}