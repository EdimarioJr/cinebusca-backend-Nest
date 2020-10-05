import { Injectable } from '@nestjs/common';
import { Review } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user-dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
  ) {}

  async create(createUser: CreateUserDto): Promise<string> {
    const { name, password } = createUser;
    // Verificando se o usuário não existe
    if (this.userModel.findOne({ name })) {
      let newUser = new this.userModel({ name, password });
      newUser.save();
      return 'Usuário criado!';
    } else return 'Esse usuário já existe!';
  }

  async login(createUser: CreateUserDto): Promise<retornoLogin> {
    const { name, password } = createUser;
    await this.userModel.findById('5f7a808286e8a91aec00083a',(err,result)=> {
        console.log(result)
    })
    
    // Verificando se o usuário existe
    if (this.userModel.findOne({ name })) {
      // Se o usuário existe, o nome e senha batem?
      if (this.userModel.findOne({ name, password }))
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

  async createReview(idUser: string, reviewRequest: Review): Promise<string> {
    const { idMovie, review, score, date } = reviewRequest;
    let user = await this.userModel.findById( idUser ,function (err) {
        if(err)
        console.log(err)
    })
    let indexReview = user.reviews.findIndex(
      reviewUser => reviewUser.idMovie === idMovie,
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

  async getAllReviews(idUser: string):Promise<any> {
    await this.userModel.findById(idUser, function(err){
        if(err)
            console.log(err)
    }).then( user => {
        return user.reviews
    })
    
  }

  async deleteReview(idUser: string, idMovieReview: number): Promise<string> {
    let user = await this.userModel.findById(idUser , function(err){
        if(err)
            console.log(err)
    })
    const indexReview = user.reviews.findIndex(
      review => review.idMovie === idMovieReview,
    );
    if (indexReview !== -1) {
      user.reviews.splice(1, indexReview);
      await user.save()
      return 'Review removido com sucesso!';
    } else return 'Review Inexistente para esse usuário!';
  }

  async getWatchlist(idUser: string): Promise<Array<string>> {
    let user  = await this.userModel.findById(idUser)
    if(user)
        return user.watchlist
    else "Usuário inexistente!"
  }

  async addMovieWatchlist(idUser: string, idMovie: string): Promise<string> {
      console.log(idUser,idMovie)
    let user = await this.userModel.findById( idUser ,function(err,result){
        console.log(result)
        return result
    })

    console.log(user)
    if (user.watchlist.find(movie => movie === idMovie))
      return 'Filme já está na watchlist!';
    else {
      user.watchlist.push(idMovie);
      await user.save()
      return 'Filme adicionado a watchlist!';
    }
  }

  async removeMovieWatchlist(idUser: string, idMovie: string): Promise<string> {
    let user = await this.userModel.findById(idUser)
    let indexMovieWatchlist = user.watchlist.findIndex(
      movie => movie === idMovie,
    );
    if (indexMovieWatchlist !== -1) {
      user.watchlist.splice(1, indexMovieWatchlist);
      await user.save()
      return 'Filme retirado da watchlist!';
    } else {
      return 'Esse filme não está na watchlist';
    }
  }
}
