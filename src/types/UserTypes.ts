export type User = {
    name: string,
    username?: string
    image: string
    id: number
}

export type UserProfile = {
    createdAt: string,
    id: number,
    image: string,
    name: string,
    numberOfRatings: 0,
    numberOfReceipts: 0,
    numberOfReviews: 0,
    numberOfSubscriptions: number,
    username?: string
}

