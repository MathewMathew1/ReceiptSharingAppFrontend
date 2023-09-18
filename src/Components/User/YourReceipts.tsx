import { useEffect, useState } from "react"
import { USER_RECEIPTS_ROUTE } from "../../routes/routes"
import { Receipt } from "../../types/Receipt"
import { useSearchParams } from "react-router-dom"
import { LoadingSpinner } from "../LoadingCircle"
import ReceiptPreview from "../Receipts/ReceiptPreview"
import Pagination from "../Pagination"
import { useAuth } from "../../Contexts/useAuth"
import Button from "../Button"
import CreateReceipt from "../Receipts/CreateReceipt"
import DeleteReceiptModal from "../Modals/DeleteReceiptModal"

const SKIP_PER_PAGE = 10

const YourReceipts = () => {
    const [receipts, setReceipts] = useState<Receipt[]>([])
    const [finishedLoading, setFinishedLoading] = useState(false)
    const [totalAmountOfReceipts, setTotalAmountOfReceipts] = useState(0)
    const [deleteModalInfo, setDeleteModalInfo] = useState<{open: boolean, receiptId: number}>({open: false, receiptId: 1})
    const [editingIndex, setEditingIndex] = useState<number|null>(null);

    

    const [searchParams, setSearchParams] = useSearchParams();

    const {user} = useAuth()

    const controller = new AbortController()

    const handleEditClick = (index: number) => {
        setEditingIndex(index);
    }

    const cancelFunction = () => {
        setEditingIndex(null)
    }

    const setNewPage = (pageNumber: number) => {
        setSearchParams({["page"]: pageNumber.toString()}) 
    }

    const handleCloseOfModal = () => {
        setDeleteModalInfo({open: false, receiptId: 1})
    }

    useEffect(() => {
        document.title = `Subscribed Receipts`;

        const fetchUserSubscribedReceipts = () => {
            const { signal } = controller

            const page = searchParams.get("page")
            const pageNumber = page? parseInt(page): 1

            setFinishedLoading(false)
      
      
            fetch(USER_RECEIPTS_ROUTE+`/${user?.id}`+`?skip=${(pageNumber-1)*SKIP_PER_PAGE}`,{
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

    if(editingIndex!==null){

        return <CreateReceipt isUpdate={true} defaultValues={receipts[editingIndex]} cancelFunction={cancelFunction} />
    }
    
    return <div>
        <div><h2 className="text-[3rem] text-bold my-3">Your receipts</h2></div>
        <div>
            {receipts.length <= 0?
                <div>
                    <h2 className="font-bold text-[3rem]">No Receipts have been found</h2>
                </div>
            :
                <div className="flex gap-3 flex-wrap justify-center">
                    {receipts.map((receipt, index)=>{
                        return <div className="flex flex-col" key={`${index} receipt`}>
                            <ReceiptPreview receipt={receipt} />
                            <div className="w-[100%]">
                                <Button onClick={() => handleEditClick(index)} className="rounded-none w-[50%]" color="blue">Edit</Button>
                                <Button onClick={() => setDeleteModalInfo({open: true, receiptId: receipt.id})} className="rounded-none w-[50%]" color="red">Delete</Button>
                            </div>
                        </div>
                        
                    })}
                    
                </div >
            }
            <div className="mt-3">
                <Pagination onPageChange={setNewPage} currentPage={searchParams.get("page")? 
                    parseInt(searchParams.get("page")!): 1} totalPages={Math.ceil(totalAmountOfReceipts/SKIP_PER_PAGE)}/>
            </div>
        </div> 
        <DeleteReceiptModal isOpen={deleteModalInfo.open} handleClose={handleCloseOfModal} receiptId={deleteModalInfo.receiptId}/>
    </div>
}
 
export default YourReceipts;