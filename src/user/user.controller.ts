import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user-dto'
import { CreateReviewDto } from './dto/create-review-dto'
import { User } from './interfaces/user.interface'

export const userTeste = {
    name: "Edimário Júnior",
    password: "teste",
    watchlist: [123123, 22212, 3444565, 222008, 909090, 998872],
    reviews: [
        {
            idMovie: 123123,
            review: "Filme bom",
            score: 8.5
        },
        {
            idMovie: 22212,
            review: "Filme ruim",
            score: 3.5
        },
        {
            idMovie: 3444565,
            review: "Filme mais ou menos",
            score: 5
        }
    ]
}


@Controller('/user')
export class UserController {
    constructor(private userService: UserService) { }

    // Criação e login do usuário
    @Get()
    returnUsers() {
        return userTeste
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }

    @Post("/login")
    auth(@Body() createUserDto: CreateUserDto): any {
        const { name, password } = userTeste
        return this.userService.login({ name, password })
    }
    // Review do Usuário
    @Get('/reviews')
    getReviews(@Body() user: User) {
        return this.userService.getAllReviews(userTeste)
    }

    @Post('/reviews')
    addReview(@Body() createReviewDto: CreateReviewDto, user: User) {
        return this.userService.createReview(userTeste, createReviewDto)
    }

    @Delete('/reviews/:id')
    deleteReview(user: User, @Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteReview(userTeste, id)
    }

    // Watchlist do Usuário
    @Get("/watchlist")
    getWatchlist(user: User): Array<number> {
        return this.userService.getWatchlist(userTeste)
    }

    @Post("/watchlist")
    addWatchlist(@Body() idMovie: number, user: User) {
        return this.userService.addMovieWatchlist(userTeste, idMovie)
    }

    @Delete("/watchlist/:id")
    removeMovieWatchlist(@Param('id', ParseIntPipe) id: number, user: User) {
        return this.userService.removeMovieWatchlist(userTeste, id)
    }
}
