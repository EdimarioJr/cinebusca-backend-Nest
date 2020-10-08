import {Strategy, ExtractJwt} from "passport-jwt"
import {PassportStrategy } from "@nestjs/passport"
import {Injectable} from "@nestjs/common"
import {jwtConstants} from "../auth.constants"
import {UserService} from "../../user/user.service"

// Estrategia Jwt que o passport pode usar

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    // No constructor passamos algumas configuracoes iniciais. o jwtFromRequest define como vamos pegar o token jwt vindo do cliente. Nesse caso eh pelo Header Bearer `token`
    // o ignoreExpiration define explicitamente que se o token expirar, o passport vai mostrar um unauthorized e proibir a rota ao usuario
    // o secretOrKey define o secret do token jwt
    constructor(private userService: UserService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret
        })
    }

    // o metodo validate da estrategia jwt eh simples, pelo fato de que o passport vai validar automaticamente o Token enviado antes de chamar esse metodo, por isso o token
    // obrigatoriamente esta valido e decodificado, portanto so resta ao metodo extrair os campos do payload e retornar. O Passport sempre vai construir um objeto user baseado no 
    // retorno do metodo validate e colocar no objeto Request.
    async validate(payload: any){
        const user = await this.userService.getByName(payload.username)
        return user
    }
}