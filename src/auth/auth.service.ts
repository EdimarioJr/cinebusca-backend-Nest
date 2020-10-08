import { Injectable } from '@nestjs/common'
import { UserService } from 'src/user/user.service';
import { JwtService } from "@nestjs/jwt"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require("bcrypt")


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(name: string, password: string): Promise<any> {
        // verificando se o usuario existe no banco de dados
        const user = await this.userService.getByName(name)
        // verificando se username e senha batem
        const isPasswordMatching = await bcrypt.compare(password,user.password)
        if (user && isPasswordMatching) {
            return user
        } else return null
    }

    // Essa funcao so vai ser chamada se o validateUser retornar o usuario
    async login(user: any) {
        // Gerando o token JWT com o payload especificado
        const payload = { username: user.name, sub: String(user._id) }
        return {
            login: true,
            message: "Acesso Garantido!",
            access_token: this.jwtService.sign(payload)
        }
    }
}