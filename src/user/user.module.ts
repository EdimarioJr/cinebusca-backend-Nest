import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import {FindUserMiddleware} from './finduser.middleware'
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

// o forFeature define quais repositórios são registrados no escopo atual.No nosso caso é o User
// Depois disso injetamos o Repositorio User no escopo do Users Service usando o @InjectRepository()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService],
  controllers: [UserController],
})

// Configurando o middleware finduser para ser aplicado nos route handlers das rotas especificadas
// na função forRoutes
export class UserModule implements NestModule{
  configure(consumer: MiddlewareConsumer){
    consumer
    .apply(FindUserMiddleware)
    .forRoutes('user/watchlist', 'user/reviews')
  }
}
