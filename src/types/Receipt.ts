import { Review } from "./Review";

export type Receipt = {
    averageRating: number,
    createdAt: string,
    description: string,
    id: number,
    imageLinks: string[],
    ingredients: Ingredient[],
    maxCookDuration: number,
    minCookDuration: number,
    numberOfRatings: number,
    numberOfSubscriptions: number,
    reviews: Review[],
    steps: string[],
    title: string,
    user: UserAuthor,
    userId: string,
    videoLink: string,
}

export type UserAuthor = {
    name: string,
    username?: string
    image: string
    id: number
}

export type Ingredient = {
    name: string;
    quantity: number;
    unit: string;
    optional: boolean;
}

export type Image = { id: number; url: string | ArrayBuffer | null; }

export type Rating = {
    userId: number
    receiptId: number
    value: number
}
