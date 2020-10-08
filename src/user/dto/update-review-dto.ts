import {IsInt, IsString} from "class-validator"

export class UpdateReviewDto {
    @IsInt()
    idMovie: number;

    @IsString()
    review: string;
}