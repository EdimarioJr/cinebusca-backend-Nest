import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user-dto'
import { CreateReviewDto } from './dto/create-review-dto'
import { AuthGuard } from '@nestjs/passport';

@Controller('/user')
export class UserController {
    constructor(private userService: UserService) { }

    // Criação e login do usuário
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }
    // Quando usamos o Guard fornecido pelo passport, a rota só será executado se o usuário for validado
    // e o parametro Req vai conter um campo user ( fornecido pelo Passport)
    @UseGuards(AuthGuard('local'))
    @Post("/login")
    auth(@Body() createUserDto: CreateUserDto): any {
        console.log("Chegou no route handler")
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
        console.log("controller", user)
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
