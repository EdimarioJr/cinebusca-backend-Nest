import {IsInt, IsString} from "class-validator"

export class CreateReviewDto{
    @IsInt()
    idMovie: number;

    @IsString()
    review: string;

    @IsInt()
    score: number;
    
    date?: Date;
}