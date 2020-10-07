import { Injectable } from '@nestjs/common'
import { UserService } from 'src/user/user.service';


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
    ) { }

    async validateUser(name: string, password: string): Promise<any> {
        console.log("oi", name)
        const user = await this.userService.getByName( name )
        if (user && user.password === password) {
            // ...result serve para separar o password do resto do usuario
            const { password, ...result } = user
            return result
        } else return null
    }
}