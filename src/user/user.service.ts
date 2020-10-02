import { Injectable } from '@nestjs/common'
import { Review, User } from './interfaces/user.interface'
import { CreateUserDto } from './dto/create-user-dto'
import {userTeste} from './user.controller'

interface retornoLogin {
    login: boolean;
    message: string;
}

@Injectable()
export class UserService {
    private readonly users: User[] = [userTeste]

    create(createUser: CreateUserDto): string {
        const { name, password } = createUser
        // Verificando se o usuário não existe
        if (this.users.findIndex(userBD => userBD.name === name) === -1) {
            this.users.push({
                name,
                password
            })
            return "Usuário criado!"
        } else return "Esse usuário já existe!"
    }

    login(createUser: CreateUserDto): retornoLogin {
        const { name, password } = createUser
        // Verificando se o usuário existe
  
        if (this.users.findIndex(userBD => userBD.name === name) !== -1) {
            // Se o usuário existe, o nome e senha batem? 
            if (this.users.findIndex(userBD => userBD.password === password && userBD.name === name)!==-1)
                return {
                    login: true,
                    message: "Acesso Garantido!"
                }
            else return {
                login: false,
                message: "Usuário ou Senha inválidos!"
            }
        } else return {
            login: false,
            message: "Usuário ou Senha inválidos!"
        }
    }

    createReview(user: User, reviewRequest: Review): string {
        const { idMovie, review, score, date } = reviewRequest
        let indexReview = user.reviews.findIndex(reviewUser => reviewUser.idMovie === idMovie)
        // Caso já exista uma review pra esse filme, atualizar
        if (indexReview !== -1) {
            user.reviews[indexReview] = {
                idMovie,
                review,
                score,
                date
            }
            return "Review Atualizado!"
        } else {
            // Caso o review do filme não exista, criar um novo
            user.reviews.push({
                idMovie,
                review,
                score,
                date
            })
            return "Review Criado!"
        }
    }

    getAllReviews(user: User):Array<Review> {
        return user.reviews
    }

    deleteReview(user: User, idMovieReview: number): string {
        const { reviews } = user
        const indexReview = reviews.findIndex(review => review.idMovie === idMovieReview)
        if (indexReview !== -1) {
            reviews.splice(1, indexReview)
            return "Review removido com sucesso!"
        }
        else return "Review Inexistente para esse usuário!"
    }

    getWatchlist(user: User): Array<number> {
        return user.watchlist
    }

    addMovieWatchlist(user: User, idMovie: number): string {
        if (user.watchlist.find(movie => movie === idMovie))
            return "Filme já está na watchlist!"
        else {
            user.watchlist.push(idMovie)
            return "Filme adicionado a watchlist!"
        }
    }

    removeMovieWatchlist(user: User, idMovie: number): string {
        let indexMovieWatchlist = user.watchlist.findIndex(movie => movie === idMovie)
        if (indexMovieWatchlist !== -1) {
            user.watchlist.splice(1, indexMovieWatchlist)
            return "Filme retirado da watchlist!"
        } else {
            return "Esse filem não está na watchlist"
        }

    }
}

