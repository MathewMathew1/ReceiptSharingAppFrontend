import { useEffect, useState } from "react"
import { RECEIPT_SUBSCRIBED_ROUTE } from "../../routes/routes"
import { Receipt } from "../../types/Receipt"
import { useSearchParams } from "react-router-dom"
import { LoadingSpinner } from "../LoadingCircle"
import ReceiptPreview from "../Receipts/ReceiptPreview"
import Pagination from "../Pagination"

const SKIP_PER_PAGE = 10

const YourSubscribeReceipts = () => {
    const [receipts, setReceipts] = useState<Receipt[]>([])
    const [finishedLoading, setFinishedLoading] = useState(false)
    const [totalAmountOfReceipts, setTotalAmountOfReceipts] = useState(0)

    const [searchParams, setSearchParams] = useSearchParams();

    const controller = new AbortController()

    const setNewPage = (pageNumber: number) => {
        setSearchParams({["page"]: pageNumber.toString()}) 
    }

    useEffect(() => {
        document.title = `Subscribed Receipts`;

        const fetchUserSubscribedReceipts = () => {
            const { signal } = controller

            const page = searchParams.get("page")
            const pageNumber = page? parseInt(page): 1

            setFinishedLoading(false)
      
      
            fetch(RECEIPT_SUBSCRIBED_ROUTE+`?skip=${(pageNumber-1)*SKIP_PER_PAGE}`,{
                method: "GET",
                credentials: 'include',
                signal,
                headers: {
                    'Content-Type': 'application/json',
            }},)
            .then((response) => {
                return response.json()
            })
            .then((data)=>{
                console.log(data)
                if(data.receipts){
                    setTotalAmountOfReceipts(data.count)
                    setReceipts(data.receipts)
                    
                }
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
 
            })
            .finally(() => setFinishedLoading(true))
        }

        fetchUserSubscribedReceipts()
    }, [searchParams.get("page")]);
    
    if(!finishedLoading) return <div className="flex flex-1 justify-center items-center">
        <LoadingSpinner big={true}/>
    </div>
    
    return <div>
        <div><h2 className="text-[3rem] text-bold my-3">Your subscribed receipts</h2></div>
        <div>
            {receipts.length <= 0?
                <div>
                    <h2 className="font-bold text-[3rem]">You haven't subscribed to any receipt yet</h2>
                </div>
            :
                <div className="flex gap-2 flex-wrap justify-center">
                    {...receipts.map((receipt, index)=>{
                        return <ReceiptPreview receipt={receipt} key={`${index} receipt`}/>

                        
                    })}
                    
                </div >
            }
            <div className="mt-3">
                <Pagination onPageChange={setNewPage} currentPage={searchParams.get("page")? 
                    parseInt(searchParams.get("page")!): 1} totalPages={Math.ceil(totalAmountOfReceipts/SKIP_PER_PAGE)}/>
            </div>
        </div> 
    </div>
}
 
export default YourSubscribeReceipts;