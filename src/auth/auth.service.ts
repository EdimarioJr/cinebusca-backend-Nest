import { Injectable } from '@nestjs/common'
import { User, UserDocument } from '../user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt'


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        private jwtService: JwtService
    ) { }

    async validateUser(name: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({ name })
        if (user && user.password === password) {
            // ...result serve para separar o password do resto do usuario
            const { password, ...result } = user
            return result
        } else return null
    }
    
    async login(user: any) {
        const payload = { name: user.name, password: user.password }
        return {
            token: this.jwtService.sign(payload)
        }
    }
}