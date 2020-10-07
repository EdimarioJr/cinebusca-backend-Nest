import { Injectable } from '@nestjs/common'
import { UserService } from 'src/user/user.service';


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        // verificando se o usuario existe no banco de dados
        const user = await this.userService.getByName( username )
        // verificando se username e senha batem
        if (user && user.password === password) {
            return user
        } else return null
    }
}