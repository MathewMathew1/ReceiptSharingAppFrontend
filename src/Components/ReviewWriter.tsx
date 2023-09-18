import { useEffect, useState } from "react"
import Button from "./Button"
import { Review } from "../types/Review"
import { REVIEW_ROUTE } from "../routes/routes"
import { severityColors } from "../types/Toast"
import { useUpdateToast } from "../Contexts/useToast"
import { stringLengthValidator } from "../Utils/validators"
import { InputError } from "./Input"
import Modal from "./Modal"

const ReviewWriter = ({id, isOpen, setIsOpen, existingReview}:{
    id: number, 
    isOpen: boolean, 
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, 
    existingReview?: Review
}) => {
    
    const [reviewText, setReviewText] = useState("")
    const [isRequestSend, setIsRequestSend] = useState(false)
    const [error, setError] = useState<string|null>(null)
    const toastUpdate = useUpdateToast()

    const controller = new AbortController()
    
    useEffect(() => {
        if(existingReview){
            setReviewText(existingReview?.reviewText)
        }
        
    }, [existingReview?.reviewText]);

    const reviewReceipt = async () => {
        const { signal } = controller;
      
        const method = existingReview? "PUT" : "POST";
      
        const body = {
            reviewText
        };
        const textReviewError = stringLengthValidator('Text Review', reviewText, 3, 1048);
        if (textReviewError){ 
            setError(textReviewError);
            return
        }


        setIsRequestSend(true)
      
        try {
          const response = await fetch(REVIEW_ROUTE + `/${id}`, {
            method: method,
            credentials: 'include',
            signal,
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json',
            }
          });
      
          const data = await response.json();
    
          if (!data.error && !data.errors) {
            location.reload()
          }else{
            toastUpdate.addToast({toastText: "Unable to review receipt", severity: severityColors.error})
          }
        } catch (error) {
          toastUpdate.addToast({toastText: "Unable to review receipt", severity: severityColors.error})
          console.error('Error fetching user data:', error);
        }finally{
            setIsRequestSend(false)
        }
    };

    const deleteReview = async () => {
        const { signal } = controller;
      
     
        try {
          const response = await fetch(REVIEW_ROUTE + `/${id}`, {
            method: "DELETE",
            credentials: 'include',
            signal,
            headers: {
              'Content-Type': 'application/json',
            }
          });
      
          const data = await response.json();
    
          if (!data.error && !data.errors) {
            location.reload()
          }else{
            toastUpdate.addToast({toastText: "Unable to delete receipt", severity: severityColors.error})
          }
        } catch (error) {
          toastUpdate.addToast({toastText: "Unable to delete receipt", severity: severityColors.error})
          console.error('Error deleting receipt:', error);
        }
    };

    return<> 
    {isOpen? 
      <Modal>  
        <div className="p-5"> 
          <div className="mt-4 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-2xl font-semibold leading-6 text-center" id="modal-title">Write a review</h3>   
          </div>
          <div className="mt-5">
              <textarea
                  value={reviewText}
                  onChange={(e)=>setReviewText(e.target.value)}
                  rows={5}
                  className="w-full p-2 dark:bg-slate-500 resize-none border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Type here..."
              ></textarea>
          </div>
          {error?
              <InputError error={error}/>
          :
              null
          }
          <div className="px-4 py-3 sm:flex justify-end sm:px-6 gap-3">
              {existingReview?
                  <Button onClick={()=>deleteReview()} color="red">Delete</Button>
              :
                  null
              }
              <Button onClick={()=>setIsOpen(false)} color="blue">Cancel</Button>
              <Button onClick={()=>reviewReceipt()} disabled={isRequestSend} color="green">Post</Button>
          </div>
        </div>
      </Modal>
    : null}
  </>
}

export default ReviewWriter