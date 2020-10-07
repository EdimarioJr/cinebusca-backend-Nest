import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
// o Método forRoot aceita todos os argumentos que o método connect do mongoose aceita
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://cinebusca:xFtPBSLYzcvV8p1a@cinebusca-app.df2eu.mongodb.net/<dbCinebusca>?retryWrites=true&w=majority',
      { useNewUrlParser: true },
    ),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
