import { BiSolidStar } from "react-icons/bi"
import { formatDate } from "../Utils/dateFormat"
import { Review as ReviewType } from "../types/Review"
import OtherUserProfileDropdown from "./OtherUserProfileDropdown"

const Review = ({review}:{review: ReviewType}) => {
    console.log(review)
    return <div className="flex flex-col bg-light-secondaryBg dark:bg-dark-secondaryBg p-5 shadow-md gap-2">
        <div className="flex items-center gap-2">
            <OtherUserProfileDropdown position="right" user={review.user}/>
            <div>{review.user.username? review.user.username: review.user.name}</div>
            <div className="flex-1 flex-row flex">
                {review.ratingValue?
                    <>
                        {Array.from(Array(review.ratingValue)).map((_index, i) => {
                            return <BiSolidStar key={`${i}star${review.userId}`}fill={"yellow" }/>
                        })}
                    </>
                :
                    null
                }
            </div>
            <div>{formatDate(review.createdAt)}</div>
        </div>
        <div className="text-left">
            {review.reviewText}
        </div>
    </div>
}

export default Review