import { useParams, useSearchParams } from "react-router-dom";
import { USER_RECEIPTS_ROUTE } from "../../routes/routes";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../LoadingCircle";
import { Receipt } from "../../types/Receipt";
import ReceiptPreview from "../Receipts/ReceiptPreview";
import Pagination from "../Pagination";

const SKIP_PER_PAGE = 10

export const UserReceipts = () => {

    const [userReceipts, setReceipts] = useState<Receipt[]>([])
    const [finishedLoading, setFinishedLoading] = useState(false)
    const [totalAmountOfReceipts, setTotalAmountOfReceipts] = useState(0)

    const [searchParams, setSearchParams] = useSearchParams();
    const { id } = useParams();

    const controller = new AbortController()

    const setNewPage = (pageNumber: number) => {
        setSearchParams({["page"]: pageNumber.toString()}) 
    }

    useEffect(() => {
        const fetchUserProfile = () => {
            const { signal } = controller
            
            const page = searchParams.get("page")
            const pageNumber = page? parseInt(page): 1

            setFinishedLoading(false)
      
            fetch(USER_RECEIPTS_ROUTE+`/${id}?skip=${(pageNumber-1)*SKIP_PER_PAGE}`,{
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
                if(!data.error && !data.errors){
                    setReceipts(data.receipts)
                    setTotalAmountOfReceipts(data.count)
                }
                
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
 
            })
            .finally(() => setFinishedLoading(true))
        }

        fetchUserProfile()
    }, [id, searchParams.get("page")]);

    if(!finishedLoading) return <div className="flex flex-1 justify-center items-center">
        <LoadingSpinner big={true}/>
    </div>
    
    return <div>
        {userReceipts.length <= 0?
            <div>
                <h2 className="font-bold text-[3rem]">No Receipts have been found</h2>
            </div>
        :
            <div className="flex gap-2 flex-wrap justify-center">
                {userReceipts.map((receipt, index)=>{
                    return <ReceiptPreview receipt={receipt} key={`${index} receipt`}/>

                    
                })}
                
            </div >
        }
        <div className="mt-3">
            <Pagination onPageChange={setNewPage} currentPage={searchParams.get("page")? 
                parseInt(searchParams.get("page")!): 1} totalPages={Math.ceil(totalAmountOfReceipts/SKIP_PER_PAGE)}/>
        </div>
    </div> 
}

export default UserReceipts