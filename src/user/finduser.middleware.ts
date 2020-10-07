import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

// Middleware que vai pegar o id do usuário enviado pelo controller e retornar o Usuário para o provider
@Injectable()
export class FindUserMiddleware implements NestMiddleware {
    //  Aqui é feita a injeção do model User na classe do middleware, para que ele possa ter acesso 
    // aos métodos e aos usuários salvos no BD
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
    ) { }

    async use(req: Request, res: Response, next: any) {
        // Confere se o user(idUser) é um Object Id válido
        if (isValidObjectId(req.body.user)) {
            // Procura o usuário no BD. Caso o usuário não exista, o findById vai retornar null
            const user = await this.userModel.findById(req.body.user)
            req.body.user = user
            next()
        } else {
            req.body.user = null
            next()
        }

    }
}