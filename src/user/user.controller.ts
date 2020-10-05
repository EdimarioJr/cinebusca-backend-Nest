import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user-dto'
import { CreateReviewDto } from './dto/create-review-dto'
import { User } from './interfaces/user.interface'


@Controller('/user')
export class UserController {
    constructor(private userService: UserService) { }

    // Criação e login do usuário
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }

    @Post("/login")
    auth(@Body() createUserDto: CreateUserDto): any {
        const { name, password } = createUserDto
        return this.userService.login({ name, password })
    }
    // Review do Usuário
    @Get('/reviews')
    getReviews(@Body() idUser:string) {
        return this.userService.getAllReviews(idUser)
    }

    @Post('/reviews')
    addReview(@Body() createReviewDto: CreateReviewDto, idUser: string) {
        return this.userService.createReview(idUser, createReviewDto)
    }

    @Delete('/reviews/:id')
    deleteReview(idUser: string, @Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteReview(idUser, id)
    }

    // Watchlist do Usuário
    @Get("/watchlist")
    getWatchlist(idUser: string): Promise<Array<string>> {
        return this.userService.getWatchlist(idUser)
    }

    @Post("/watchlist")
    addWatchlist(@Body() addToWatchlist: any) {
        const {idUser,idMovie} = addToWatchlist
        console.log(idUser,idMovie)
        return this.userService.addMovieWatchlist(idUser, idMovie)
    }

    @Delete("/watchlist/:id")
    removeMovieWatchlist(@Param('id', ParseIntPipe) id: string, idUser: string) {
        return this.userService.removeMovieWatchlist(idUser, id)
    }
}
