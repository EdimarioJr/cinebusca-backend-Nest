import { Module,forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule} from "../auth/auth.module"

// o forFeature define quais repositórios são registrados no escopo atual.No nosso caso é o User
// Depois disso injetamos o Repositorio User no escopo do Users Service usando o @InjectRepository()
// O forwardRef serve para resolver a dependencia circular, ja que o UserModule usa o AuthModule e o AuthModule usa o UserModule
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), forwardRef(()=>AuthModule)
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
