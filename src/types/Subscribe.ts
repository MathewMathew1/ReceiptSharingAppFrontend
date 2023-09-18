import { UserAuthor } from "./Receipt"

export type UserSubscription = {
    subscriptionStart: string,
    user: UserAuthor
    userId: number,
    userSubscribedToId: number,
    userSubscribedTo: UserAuthor
}

