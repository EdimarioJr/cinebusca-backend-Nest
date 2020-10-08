import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'
import {Review} from '../interfaces/user.interface'
// Definindo a entidade User
// No mongoose, tudo vem dos schemas. Cada schema é mapeado para uma collection MongoDB e define a forma
// dos documentos.Os Schemas definem os Modelos, e os Modelos são usados para manipular e criar documentos

export type UserDocument = User & Document
@Schema()
export class User{

    @Prop({required: true, unique: true})
    name: string;
    
    @Prop({required: true})
    password: string;

    @Prop({default: []})
    watchlist: Array<number>;

    @Prop({default: []})
    reviews: Array<Review>;
}

// O @Schema decorator marca a classe como um Schema. Esse Schema vai ser mapeado para uma coleçao MongoDB
// de nome users

export const UserSchema = SchemaFactory.createForClass(User)