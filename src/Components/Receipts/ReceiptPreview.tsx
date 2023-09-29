import { Receipt } from "../../types/Receipt"
import {BiSolidCommentDetail, BiSolidStar} from "react-icons/bi"
import {BsClockFill} from "react-icons/bs"
import {FcLike} from "react-icons/fc"
import {formatDate} from "../../Utils/dateFormat"
import Tooltip from "../Tooltip"
import { Link } from "react-router-dom"

const ReceiptPreview = ({receipt}: {receipt: Receipt}) => {

    return <div className="flex-col glass w-[280px]">
            <Link to={`/receipt/${receipt.id}`} className="text-light-text h-[100%] hover:text-light-text dark:hover:text-dark-text dark:text-dark-text">
                <div className="flex flex-col h-[100%]">
                    <div className="flex justify-center h-[200px]">
                        <img alt={receipt.title} width={200} height={200} src={receipt.imageLinks[0]}></img>
                    </div>
                    <div><h3 className="font-bold">{receipt.title}</h3></div>
                    <div className="overflow-hidden break-words my-2 flex-1 "  >
                        <div className="text-left overflow-hidden text-ellipsis line-clamp-5 md:line-clamp-3 custom-html-style">
                            {receipt.description}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex gap-3 justify-end flex-1">
                            <div className="flex items-center gap-1">
                                <Tooltip tooltipText="Rewiews amount"><BiSolidCommentDetail/></Tooltip>{receipt.reviews.length}
                            </div>
                            <div className="flex items-center gap-1"> 
                                <Tooltip tooltipText="Rating"><BiSolidStar fill={"yellow"}/> </Tooltip>
                                {receipt.averageRating}({receipt.numberOfRatings})
                            </div>
                            <div className="flex items-center gap-1"> 
                                <Tooltip tooltipText="Number of subscriptions">
                                    <FcLike/>
                                </Tooltip>
                                {receipt.numberOfSubscriptions}
                            </div>
                            
                        </div>
                        <div className="flex justify-end gap-3">
                            <div className="flex items-center gap-1">
                                <div>
                                    {receipt.minCookDuration}-{receipt.maxCookDuration}
                                </div>
                                <div>
                                <Tooltip tooltipText="Cook duration"><BsClockFill/></Tooltip>
                                </div>
                            </div>
                            <div className="font-[0.8rem]">{formatDate(receipt.createdAt)}</div>          
                        </div>  
                    </div>
                </div>  
            </Link>
        </div>
    
}

export default ReceiptPreview