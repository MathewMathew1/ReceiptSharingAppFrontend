import { useEffect, useState } from "react";
import { USER_CHANGE_USERNAME, USER_PROFILE_ROUTE } from "../../routes/routes";
import { LoadingSpinner } from "../LoadingCircle";
import type { UserProfile as UserProfileType } from "../../types/UserTypes";
import { ProfileImage } from "../ProfileImage";
import { formatDate } from "../../Utils/dateFormat";
import { useAuth } from "../../Contexts/useAuth";
import { InputGroup } from "../Input";
import Button from "../Button";
import { stringLengthValidator } from "../../Utils/validators";
import { useUpdateToast } from "../../Contexts/useToast";
import { severityColors } from "../../types/Toast";

const CurrentUserProfile = () => {
    const [userProfile, setUserProfile] = useState<null|UserProfileType>(null)
    const [finishedLoading, setFinishedLoading] = useState(false)
    const [sendRequestAboutChangingUsername, setSendRequestAboutChangingUsername] = useState(false)
    const [username, setUsername] = useState("")
    const [error, setError] = useState<null|string>(null)

    const updateToast = useUpdateToast()

    const {user } = useAuth()

    const controller = new AbortController()


    useEffect(() => {
        const fetchUserProfile = () => {
            const { signal } = controller

            setFinishedLoading(false)
      
            fetch(USER_PROFILE_ROUTE+`/${user?.id}`,{
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
                if(data.user){
                    setUserProfile(data.user)
                    document.title = `User ${data.user.username? data.user.username: data.user.name} Profile `;
                }
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
 
            })
            .finally(() => setFinishedLoading(true))
        }

        fetchUserProfile()
    }, [user?.id]);

    const changeUsername = () => {
        const { signal } = controller

        const usernameError = stringLengthValidator('Username', username, 2, 64);
        if (usernameError){ 
            setError(usernameError)
            return
        }
        setError(null)

        setSendRequestAboutChangingUsername(true)
        
        const body = {
            username
        }
        
        fetch(USER_CHANGE_USERNAME,{
            method: "PATCH",
            credentials: 'include',
            signal,
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
        }},)
        .then((response) => {
            return response.json()
        })
        .then((data)=>{
            console.log(data)
            if(!data.error && !data.errors){
                setUserProfile((userProfile) => {
                    return {
                        ...userProfile!,
                        username
                    }
                })
                setUsername("")
                updateToast.addToast({toastText: "Successfully updated username", severity: severityColors.success})
            }
            else{
                updateToast.addToast({toastText: "Unable to change username", severity: severityColors.error})
            }
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);

        })
        .finally(() => setSendRequestAboutChangingUsername(false))
    }


    if(!finishedLoading) return <div className="flex flex-1 justify-center items-center">
        <LoadingSpinner big={true}/>
    </div>

    if(!userProfile) return <div>
        <h2 className="font-bold text-[3rem]">User Not Found</h2>
    </div>

    return <div className="flex flex-col  mt-4 glass md:w-[80%] w-[100%] mx-[auto] justify-center">
        <div className="flex flex-col  justify-center items-center">
            <div className="flex justify-center gap-2">
                <h2 className="text-2xl font-bold">Account information  </h2>
                <div className="flex"><ProfileImage src={userProfile.image}/></div>
            </div>
            <div className="flex w-fit flex-col justify-center mt-3 py-10 px-20 shadow">
                <div className="text-left ">Username: {userProfile.username}</div>
                <div className="text-left ">Name: {userProfile.name}</div>
                <div className="text-left">Created Account at: {formatDate(userProfile.createdAt)}</div>
                <div className="text-left">Number of reviews: {userProfile.numberOfReviews}</div>
                <div className="text-left">Number of subscribed users: {userProfile.numberOfSubscriptions}</div>
                <div className="text-left">Number of receipts: {userProfile.numberOfReceipts}</div>
      
            </div>
            <div className="flex flex-col">
                <h2 className="text-2xl mt-3">Change User Data:</h2>
                <div className="mt-3">
                    <InputGroup error={error} labelName="Username" name="Username" value={username} handleInputChange={(e)=>setUsername(e.target.value)}/>
                </div>
                <div className="flex justify-end">
                    <Button disabled={sendRequestAboutChangingUsername} onClick={()=>changeUsername()} color="green">Save</Button>
                </div>
            </div>  
        </div>  
    </div>
}

export default CurrentUserProfile