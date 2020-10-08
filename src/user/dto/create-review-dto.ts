import {IsInt, IsString,IsDate} from "class-validator"

export class CreateReviewDto{
    @IsInt()
    idMovie: number;

    @IsString()
    review: string;

    @IsInt()
    score: number;
    
    @IsDate()
    date?: Date;
}