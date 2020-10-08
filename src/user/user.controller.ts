import { Controller, Get, Post, Body, Request,Param, Delete, ParseIntPipe, UseGuards, Put, ValidationPipe } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user-dto'
import {LocalAuthGuard} from '../auth/local-auth.guard'
import {JwtAuthGuard} from "../auth/jwt-auth.guard"
import {AuthService} from "../auth/auth.service"
import { CreateReviewDto } from './dto/create-review-dto'
import {UpdateReviewDto} from "./dto/update-review-dto"
import {statusOperacao} from "./user.service"


@Controller('/user')
export class UserController {   
    constructor(private userService: UserService, private authService: AuthService) { }

    // Criação e login do usuário
    @Post()
    create(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<statusOperacao> {
        const {name,password} = createUserDto
        return this.userService.create(name,password)
    }

    // Quando usamos o Guard fornecido pelo passport, a rota só será executado se o usuário for validado
    // e o parametro Req vai conter um campo user (fornecido pelo Passport)
    @UseGuards(LocalAuthGuard)
    @Post("/login")
    // Como os parametros enviados pelo cliente nao vao ser usados diretamente pela rota login, mas sim pelo Guard e pela autenticacao Passport,
    // nao e preciso declarar nenhum parametro no route handler auth
    // O usuario eh devolvido automaticamente pelo passport assim que ele valida a tentativa de login. Usamos esse user mandando para a funcao login do authService, e essa funcao,
    // por sua vez, vai gerar o JWT e mandar de volta para o cliente
    auth(@Request() req) : any{
        return this.authService.login(req.user)
    }


    @UseGuards(JwtAuthGuard)
    // Review do Usuário
    @Get('/reviews')
    getReviews(@Request() req: any) : Promise<statusOperacao>{
        return this.userService.getAllReviews(req.user)
    }


    @UseGuards(JwtAuthGuard)
    @Post('/reviews')
    addReview(@Body(new ValidationPipe()) createReviewDto: CreateReviewDto, @Request() req) : Promise<statusOperacao>{
        const {idMovie,review,score} = createReviewDto
        return this.userService.createReview(req.user, idMovie,review,score)
    }

    @UseGuards(JwtAuthGuard)
    @Put('/reviews')
    updateReview(@Request() req, @Body(new ValidationPipe()) updateReviewDto: UpdateReviewDto): Promise<statusOperacao>{
        const {idMovie, review} = updateReviewDto
        return  this.userService.updateReview(req.user, idMovie, review)
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/reviews/:id')
    deleteReview(@Request() req, @Param("id", ParseIntPipe) id: any) : Promise<statusOperacao>{
        return this.userService.deleteReview(req.user, id)
    }


    @UseGuards(JwtAuthGuard)
    // Watchlist do Usuário
    @Get("/watchlist")
    getWatchlist(@Request() req): Promise<statusOperacao> {
        return this.userService.getWatchlist(req.user)
    }


    @UseGuards(JwtAuthGuard)
    // Os decorators @Body, @Param e afins aceitam uma variável (no caso do @body um objeto e no caso do @param uma primitiva)
    @Post("/watchlist")
    addWatchlist(@Request() req, @Body() id: any): any {
        const {idMovie} = id
        return this.userService.addMovieWatchlist(req.user, idMovie)
    }


    @UseGuards(JwtAuthGuard)
    @Delete("/watchlist/:id")
    removeMovieWatchlist(@Request() req, @Param("id", ParseIntPipe) id: any):Promise<statusOperacao> {
        return this.userService.removeMovieWatchlist(req.user, id)
    }
}
