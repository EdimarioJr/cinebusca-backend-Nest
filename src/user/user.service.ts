import { Injectable } from '@nestjs/common';
import { Review } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user-dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

interface retornoLogin {
  login: boolean;
  message: string;
}

// Injetamos o Model no serviço através do InjectModel. Toda a manipulação de dados no BD vai ser feita
// Através desse model.

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) { }

  async create(createUser: CreateUserDto): Promise<string> {
    const { name, password } = createUser;
    // Verificando se os dois parâmetros estão sendo mandados
    if (name && password) {
      /*
      Verificando se o usuário não existe
       Se o findOne acha algo, ele retorna o documento que corresponde a query, caso contrário retorna null 
       */
      if (!await this.userModel.findOne({ name })) {
        let newUser = new this.userModel({ name, password });
        newUser.save();
        return 'Usuário criado!';
      } else return 'Esse usuário já existe!';
    } else "Informe um nome e uma senha!"

  }

  async login(createUser: CreateUserDto): Promise<retornoLogin> {
    const { name, password } = createUser;

    // Verificando se o usuário existe
    if (await this.userModel.findOne({ name })) {
      // Se o usuário existe, o nome e senha batem?
      if (await this.userModel.findOne({ name, password }))
        return {
          login: true,
          message: 'Acesso Garantido!',
        };
      else
        return {
          login: false,
          message: 'Usuário ou Senha inválidos!',
        };
    } else
      return {
        login: false,
        message: 'Usuário ou Senha inválidos!',
      };
  }

  async createReview(user: any, reviewRequest: Review): Promise<string> {
    const { idMovie, review, score, date } = reviewRequest;
    let indexReview = user.reviews.findIndex(
      (reviewUser) => reviewUser.idMovie === idMovie,
    );
    // Caso já exista uma review pra esse filme, atualizar
    if (indexReview !== -1) {
      user.reviews[indexReview] = {
        idMovie,
        review,
        score,
        date
      }
      await user.save()
      return 'Review Atualizado!';
    } else {
      // Caso o review do filme não exista, criar um novo
      user.reviews.push({
        idMovie,
        review,
        score,
        date,
      });
      await user.save()
      return 'Review Criado!';
    }
  }

  async getAllReviews(user: any): Promise<any> {
    if (user) {
      return user.reviews
    } else return "Usuário não existe!"
  }

  async deleteReview(user: any, idMovieReview: number): Promise<string> {
    if(user){
      const indexReview = user.reviews.findIndex(
        review => review.idMovie === idMovieReview,
      );
      if (indexReview !== -1) {
        user.reviews.splice(indexReview, 1);
        await user.save()
        return 'Review removido com sucesso!';
      } else return 'Review Inexistente para esse usuário!';
    } else return "Usuário Inexistente"
    
  }

  async getWatchlist(user: any): Promise<any> {
    if (user)
      return user.watchlist
    else return "Esse usuário não existe!"
  }

  async addMovieWatchlist(user: any, idMovie: string): Promise<string> {
    if (user) {
      // Se o filme já existe na watchlist, não faz nada
      if (user.watchlist.find((movie: string) => movie === idMovie))
        return 'Filme já está na watchlist!';
      else {
        // Caso o filme não exista, adiciona no array e salva
        user.watchlist.push(idMovie);
        await user.save()
        return 'Filme adicionado a watchlist!';
      }
    } else return "Usuário Não Existe!"

  }

  async removeMovieWatchlist(user: any, idMovie: string): Promise<string> {
    if (user) {
      // Procura o index do filme no array watchlist
      let indexMovieWatchlist = user.watchlist.findIndex(
        (movie: string) => {
          return movie == idMovie
        }
      );
      if (indexMovieWatchlist !== -1) {
        // retira do array
        user.watchlist.splice(indexMovieWatchlist, 1);
        console.log(user.watchlist)
        // salva as atualizações no BD
        await user.save()
        return 'Filme retirado da watchlist!';
      } else {
        return 'Esse filme não está na watchlist';
      }
    } else return "Usuário não existe"

  }
}
