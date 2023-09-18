import { UserAuthor } from "./Receipt"

export type Review = {
    userId: number,
    receiptId: number,
    reviewText: string
    user: UserAuthor
    createdAt: string
    ratingValue?: number
}

