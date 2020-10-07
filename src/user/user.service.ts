import { Injectable } from '@nestjs/common';
import { Review } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user-dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// op eh a flag que vai indicar para o front end se a operacao teve sucesso ou nao
export interface statusOperacao{
  op: boolean;
  message: string;
  watchlist?: Array<number>;
  reviews?: Array<Review>
}

// Injetamos o Model no serviço através do InjectModel. Toda a manipulação de dados no BD vai ser feita
// Através desse model.

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(createUser: CreateUserDto): Promise<statusOperacao> {
    const {name, password} = createUser
    // Verificando se os dois parâmetros estão sendo mandados
    if (name && password) {
      /*
      Verificando se o usuário não existe
       Se o findOne acha algo, ele retorna o documento que corresponde a query, caso contrário retorna null 
       */
      if (!(await this.userModel.findOne({ name}))) {
        const newUser = new this.userModel({ name, password });
        newUser.save();
        return {
          op: true,
          message: "Usuario criado com sucesso!"
        }
      } else return {
        op: false,
        message: "Usuario ja existe!"
      };
    } else return {
      op: false,
      message: "Informe um nome e uma senha!"
    };
  }

  async getByName(name: string): Promise<any> { 
    return await this.userModel.findOne({ name });
  }

  async createReview(user: any, reviewRequest: Review): Promise<statusOperacao> {
    if(user){
      const { idMovie, review, score} = reviewRequest;
      // Conferindo se os parametros necessarios sao nao nulos ou strings vazias
        const indexReview = user.reviews.findIndex(
          reviewUser => reviewUser.idMovie === idMovie,
        );
        // Caso já exista uma review pra esse filme, atualizar
        if (indexReview !== -1) {
          user.reviews[indexReview] = {
            idMovie,
            review,
            score,
            date : new Date()
          };
          await user.save();
          return {
            op: true,
            message: "Review atualizado!"
          };
        } else {
          // Caso o review do filme não exista, criar um novo
          user.reviews.push({
            idMovie,
            review,
            score,
            date: new Date(),
          });
          await user.save();
          return {
            op: true,
            message: "Review criado com sucesso!"
          }
      }
    } else {
      return {
        op: false,
        message: "Usuario inexistente"
      }
    }
   
  }

  async updateReview(user: any, idMovie: number, newReview: string): Promise<statusOperacao>{
    if(user){
      const indexMovie = user.reviews.findIndex( movie => movie.idMovie === idMovie)
      if(indexMovie !== -1){
        user.reviews[indexMovie].review = newReview
        user.reviews[indexMovie].date = new Date()
        await user.save()
        return {
          op: true,
          message: "Review atualizada com sucesso!"
        }
      } else {
        return {
          op: false,
          message: "Esse filme nao existe em suas reviews!"
        }
      }
    } else return {
      op: false,
      message: "Usuario inexistente ou nao autenticado!"
    }
   
  }

  async getAllReviews(user: User): Promise<statusOperacao> {
    if (user) {
      return {
        op: true,
        message: "Reviews retornados com sucesso!",
        reviews: user.reviews
      }
    } else return {
      op: false,
      message: "Usuario inexistente!"
    }
  }

  async deleteReview(user: any, idMovieReview: number): Promise<statusOperacao> {
    if (user) {
      const indexReview = user.reviews.findIndex(
        review => review.idMovie === idMovieReview,
      );
      if (indexReview !== -1) {
        user.reviews.splice(indexReview, 1);
        await user.save();
        return {
          op: true,
          message: "Review removido com sucesso"
        };
      } else return {
        op: false,
        message: " Review inexistente para esse usuario!"
      };
    } else return {
      op: false,
      message: "Usuario inexistente!"
    }
  }

  async getWatchlist(user: User): Promise<statusOperacao> {
    if (user) return {
      op: true,
      message: "Watchlist retornada!",
      watchlist: user.watchlist
    };
    else return {
      op: false,
      message: "Usuario inexistente!"
    };
  }

  async addMovieWatchlist(user: any, idMovie: number): Promise<statusOperacao> {
    if (user) {
      // Se o filme já existe na watchlist, não faz nada
      if (user.watchlist.find((movie: number) => movie === idMovie))
        return {
          op: false,
          message: "Filme ja esta na watchlist!"
        }
      else {
        // Caso o filme não exista, adiciona no array e salva
        user.watchlist.push(idMovie);
        await user.save();
        return {
          op: true,
          message: "Filme adicionad a watchlist"
        }
      }
    } else return {
      op: false,
      message: "Usuario inexistente!"
    };
  }

  async removeMovieWatchlist(user: any, idMovie: number): Promise<statusOperacao> {
    if (user) {
      // Procura o index do filme no array watchlist
      const indexMovieWatchlist = user.watchlist.findIndex((movie: number) => {
        return movie == idMovie;
      });
      if (indexMovieWatchlist !== -1) {
        // retira do array
        user.watchlist.splice(indexMovieWatchlist, 1);
        console.log(user.watchlist);
        // salva as atualizações no BD
        await user.save();
        return {
          op: true,
          message: "Filme retirado da watchlist!"
        };
      } else {
        return {
          op: false,
          message: "Esse filme nao esta na sua watchlist!"
        };
      }
    } else return {
      op: false,
      message: "Usuario inexistente"
    };
  }
}
