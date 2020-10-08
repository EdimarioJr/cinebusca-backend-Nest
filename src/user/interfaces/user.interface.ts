export interface UserInterface{
    name: string;
    password: string;
    watchlist?: Array<number>;
    reviews?: Array<Review>;
    save?: any;
    markModified?:any;
}

export interface Review{
    idMovie: number;
    review: string;
    score?: number;
    date?: Date;
}