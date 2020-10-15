import {IsInt, IsString} from "class-validator"

export class CreateReviewDto{
    @IsInt()
    idMovie: number;

    @IsString()
    review: string;

    score: number;
    
    date?: Date;
}