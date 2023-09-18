import { useState } from "react";
import { RECEIPTS_ROUTE } from "../../routes/routes";
import Button from "../Button";
import Modal from "../Modal";
import { useUpdateToast } from "../../Contexts/useToast";
import { severityColors } from "../../types/Toast";

const DeleteReceiptModal = ({isOpen, handleClose, receiptId}: {
    isOpen: boolean, 
    handleClose: () => void,
    receiptId: number
}) => {

    const updateToast = useUpdateToast()
    const [sendDeleteRequest, setSendDeleteRequest] = useState(false)

    const controller = new AbortController()

    const deleteReceiptModal = () => {
        const { signal } = controller

        setSendDeleteRequest(true)

        fetch(RECEIPTS_ROUTE+`/${receiptId}`,{
            method: "DELETE",
            signal,
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if(!data.error && !data.errors){
                location.reload()
            }else{
                updateToast.addToast({toastText: "Unable to delete receipt", severity: severityColors.error})
            }
            
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
            setSendDeleteRequest(false);
        }).finally(()=>{
            setSendDeleteRequest(false)
        });
    }

    return <> 
    {isOpen?
        <Modal>
            <div className="flex mt-3 flex-col p-5">
                <div> <h3 className="text-[2rem] text-bold mb-3">Are you sure you want to delete receipt?</h3></div>
                <div className="flex justify-end gap-2">
                    <Button color="blue" onClick={()=>handleClose()}>Cancel</Button>
                    <Button disabled={sendDeleteRequest} color="red" onClick={()=>deleteReceiptModal()}>Delete</Button>
                </div>
            </div>
        </Modal>
    :
        null
    }
    </>
}
 
export default DeleteReceiptModal;