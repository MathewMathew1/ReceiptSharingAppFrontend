import { Link, useParams } from "react-router-dom";
import { RECEIPTS_ROUTE } from "../../routes/routes";
import { useEffect, useState } from "react";
import { Receipt } from "../../types/Receipt";
import { LoadingSpinner } from "../LoadingCircle";
import ImageCarousel from "../ImageCarousel";
import Tooltip from "../Tooltip";
import { BsClockFill } from "react-icons/bs";
import { formatDate } from "../../Utils/dateFormat";
import { FcLike } from "react-icons/fc";
import { BiSolidStar } from "react-icons/bi";
import { useAuth } from "../../Contexts/useAuth";
import Button from "../Button";
import StarRating from "../StarComponent";
import Review from "../Review";
import ReviewWriter from "../ReviewWriter";
import OtherUserProfileDropdown from "../OtherUserProfileDropdown";

const ReceiptComponent = () => {
    const [receipt, setReceipt] = useState<Receipt>()
    const [fetchedReceipt, setFetchedReceipt] = useState(false)
    const [isSubscribing, setIsSubscribing] = useState(false)
    const [openReviewWriter, setOpenReviewWriter] = useState(false)

    const {user, subscribedReceiptsIds, subscribeToReceipt, ratings} = useAuth()

    const controller = new AbortController()

    const { id } = useParams();

    const handleSubscribe = async () => {
        if(isSubscribing || !receipt?.id){
            return
        }
        setIsSubscribing(true)
        await subscribeToReceipt(isUserSubscribed, receipt.id)
        setIsSubscribing(false)
    }

    useEffect(() => {
       const fetchReceipt = async () => {
            if(id==null){
                setFetchedReceipt(true)
                return
            }

            try{
                setFetchedReceipt(false)

                const { signal } = controller
                const response = await fetch(RECEIPTS_ROUTE+`/${id}`,{
                  method: "GET",
                  signal
                })
                
                const data  = await response.json()
                
                if(!data.error && !data.errors){
                  setReceipt(data.receipt)
                }
            }catch(e){
                console.log(e)
            }finally{
                setFetchedReceipt(true)
            }
            {id}
       } 

       fetchReceipt()
    }, [id]);

    if(!fetchedReceipt) return <div className="flex flex-1 justify-center items-center">
        <LoadingSpinner big={true}/>
    </div>

    if(!receipt) return <div>
        <h2 className="font-bold text-[3rem]">Receipt Not Found</h2>
    </div>

    const isUserSubscribed = subscribedReceiptsIds.findIndex((id)=>receipt.id===id) !== -1
    const ratingOfReceipt = ratings.find((rating)=>rating.receiptId===receipt.id)?.value
    const yourReview = receipt.reviews.find((review)=>review.userId===user?.id)

    return <>
        <div className="flex flex-col align-center glass w-[100%] md:w-[90%] md:mx-[auto] p-0 md:px-2 py-2">
            <div>
                <h2 className="text-[2rem]">{receipt.title}</h2>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center md:gap-10">
                <div>
                    <h3 className="text-[1.6rem]">Image previews</h3>
                    <ImageCarousel images={[...receipt.imageLinks]}/>
                </div>
                {receipt.videoLink?
                    <div className="flex flex-col">
                        <h3 className="text-[1.6rem]">Video Showcase</h3>
                        <iframe
                            className="w-[100%] md:w-[400px] h-[300px] md:h-[300px]"   
                            src={receipt.videoLink}
                            title="YouTube Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                :
                    null
                }
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-10">
                <div className="w-full sm:w-[180px]">
                    <div>
                        <h3 className="text-[1.6rem] font-bold">Author:</h3>
                        <div className="flex gap-2">
                            <OtherUserProfileDropdown user={receipt.user} position="right"/> 
                            <div className="flex-1 text-left">{receipt.user.username? receipt.user.username: receipt.user.name}</div>
                        </div>
                    </div>
                    <div >
                        <h3 className="text-[1.6rem] font-bold">Ingredients:</h3>
                        {[...receipt.ingredients].map((ingredient, index) => (
                            <div key={`${index} ingredient`} className="flex gap-1 glass border-solid border-2 border-indigo-600 p-2">
                                <div>{ingredient.name}</div>
                                <div>{ingredient.quantity}</div>
                                <div>{ingredient.unit}</div>
                                <div>{ingredient.optional? "*" : ""}</div>
                            </div>
                        ))}

                        <div>
                            <p className="text-[0.9rem] pl-2"> * - optional ingredient</p>
                        </div>

                        <div className="flex items-center gap-1 pl-2">
                            <div>
                                {receipt.minCookDuration}-{receipt.maxCookDuration}
                            </div>
                            <div >
                                <Tooltip tooltipText="Cook duration"><BsClockFill/></Tooltip>
                            </div>
                        </div>
                    </div>  
                </div>
                <div className="flex-1">
                    <div className="text-left sm:pt-5 break-all">
                        {receipt.description}
                    </div>

                    <div>
                        {[...receipt.steps].map((step, index) => (
                            <div className="glass flex gap-2" key={`${index} step`}>
                            <div className="">{index}.</div> 
                            <div className="flex-1 text-left">{step}</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex text-left gap-3 flex-col md:flex-row p-2">
                        <div>Created at {formatDate(receipt.createdAt)}</div>
                        <div className="flex items-center gap-1">Number of subscriptions: {receipt.numberOfSubscriptions} <FcLike/></div>
                        <div className="flex items-center gap-1">Rating: {receipt.averageRating}({receipt.numberOfRatings}) <BiSolidStar fill={"yellow"}/>
                        </div>
                        
                    </div>
                    {user?
                    <div className="flex justify-start gap-3">
                        <div>
                            <Button disabled={isSubscribing} color="green" onClick={()=> handleSubscribe()}>{isUserSubscribed? "Unsubscribe": "Subscribe"}</Button>
                        </div>
                        <StarRating rating={ratingOfReceipt} id={receipt.id}/>
                    </div>
                    :
                        null
                    }

                    <div>
                        <h3 className="text-2xl">Reviews:</h3>
                        <div>
                            {user?
                                <>
                                    {yourReview?
                                        <p className="text-blue-500" onClick={()=>setOpenReviewWriter(true)}>Update a review</p>
                                    :
                                        <p className="text-blue-500" onClick={()=>setOpenReviewWriter(true)}>Write a review</p>
                                    }
                                </>
                            :
                                <p>
                                    <Link to={"/login"}>Login in</Link> to write a review
                                </p>
                            }
                        </div>
                        <div className="my-3">
                            {receipt.reviews.length>0?
                                <>
                                    {receipt.reviews.map((review, index) => {
                                    return <Review key={`${index}review`} review={review}/>
                                    })}
                                </>
                            :
                                <div>
                                    <h3>There are no reviews so far</h3>
                                </div>   
                            }
                        </div>
                    </div>
                </div>
            </div>
        
            
        
        </div>
        <ReviewWriter existingReview={yourReview} id={receipt.id} isOpen={openReviewWriter} setIsOpen={setOpenReviewWriter}/>
    </>
}

export default ReceiptComponent