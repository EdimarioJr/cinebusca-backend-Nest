export interface User{
    name: string;
    password: string;
    watchlist?: Array<number>;
    reviews?: Array<Review>;
}

export interface Review{
    idMovie: number;
    review: string;
    score?: number;
    date?: Date;
}