import { Controller, Get, Post, Body, Request,Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user-dto'
import {LocalAuthGuard} from '../auth/local-auth.guard'
import {JwtAuthGuard} from "../auth/jwt-auth.guard"
import {AuthService} from "../auth/auth.service"
import { CreateReviewDto } from './dto/create-review-dto'

@Controller('/user')
export class UserController {
    constructor(private userService: UserService, private authService: AuthService) { }

    // Criação e login do usuário
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }

    // Quando usamos o Guard fornecido pelo passport, a rota só será executado se o usuário for validado
    // e o parametro Req vai conter um campo user (fornecido pelo Passport)
    @UseGuards(LocalAuthGuard)
    @Post("/login")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // Como os parametros enviados pelo cliente nao vao ser usados diretamente pela rota login, mas sim pelo Guard e pela autenticacao Passport,
    // nao e preciso declarar nenhum parametro no route handler auth
    // O usuario eh devolvido automaticamente pelo passport assim que ele valida a tentativa de login. Usamos esse user mandando para a funcao login do authService, e essa funcao,
    // por sua vez, vai gerar o JWT e mandar de volta para o cliente
    auth(@Request() req) : any {
        return this.authService.login(req.user)
    }


    @UseGuards(JwtAuthGuard)
    // Review do Usuário
    @Get('/reviews')
    getReviews(@Request() req: any) {
        return this.userService.getAllReviews(req.user)
    }


    @UseGuards(JwtAuthGuard)
    @Post('/reviews')
    addReview(@Body() createReviewDto: CreateReviewDto, @Request() req) {
        return this.userService.createReview(req.user, createReviewDto)
    }


    @UseGuards(JwtAuthGuard)
    @Delete('/reviews/:id')
    deleteReview(@Request() req, @Param("id", ParseIntPipe) id: any) {
        return this.userService.deleteReview(req.user, id)
    }


    @UseGuards(JwtAuthGuard)
    // Watchlist do Usuário
    @Get("/watchlist")
    getWatchlist(@Request() req): Promise<Array<string>> {
        return this.userService.getWatchlist(req.user)
    }


    @UseGuards(JwtAuthGuard)
    // Os decorators @Body, @Param e afins aceitam uma variável (no caso do @body um objeto e no caso do @param uma primitiva)
    @Post("/watchlist/:id")
    addWatchlist(@Request() req, @Param("id", ParseIntPipe) id) {
        return this.userService.addMovieWatchlist(req.user, id)
    }


    @UseGuards(JwtAuthGuard)
    @Delete("/watchlist/:id")
    removeMovieWatchlist(@Request() req, @Param("id", ParseIntPipe) id: any) {
        console.log(req.user,id)
        return this.userService.removeMovieWatchlist(req.user, id)
    }
}
