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
    getReviews(@Body() user: any) {
        return this.userService.getAllReviews(user.user)
    }

    @Post('/reviews')
    addReview(@Body() addReviewDto: any) {
        const { user, createReviewDto } = addReviewDto
        return this.userService.createReview(user, createReviewDto)
    }

    @Delete('/reviews')
    deleteReview(@Body() deleteReview: any) {
        const { user, idMovie } = deleteReview
        return this.userService.deleteReview(user, idMovie)
    }

    // Watchlist do Usuário
    @Get("/watchlist")
    getWatchlist(@Body() user: any): Promise<Array<string>> {
        console.log("controller",user)
        return this.userService.getWatchlist(user.user)
    }

    // Os decorators @Body, @Param e afins aceitam uma variável (no caso do @body um objeto e no caso do @param uma primitiva)
    @Post("/watchlist")
    addWatchlist(@Body() addToWatchlist: any) {
        const { user, idMovie } = addToWatchlist
        return this.userService.addMovieWatchlist(user, idMovie)
    }

    @Delete("/watchlist")
    removeMovieWatchlist(@Body() deleteMovieOnWatchlist: any) {
        const { user, idMovie } = deleteMovieOnWatchlist
        return this.userService.removeMovieWatchlist(user, idMovie)
    }
}
