import { useEffect, useState } from "react";
import { USER_PROFILE_ROUTE } from "../../routes/routes";
import { LoadingSpinner } from "../LoadingCircle";
import { Link, useParams } from "react-router-dom";
import type { UserProfile as UserProfileType } from "../../types/UserTypes";
import { ProfileImage } from "../ProfileImage";
import { formatDate } from "../../Utils/dateFormat";
import Button from "../Button";
import { useAuth } from "../../Contexts/useAuth";
import { UserAuthor } from "../../types/Receipt";
import UserReceipts from "./UserReceipts";

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState<null|UserProfileType>(null)
    const [finishedLoading, setFinishedLoading] = useState(false)
    const [sendRequestAboutUnsubscribing, setSendRequestAboutUnsubscribing] = useState(false)

    const {user, subscriptionUsers, subscribeToUser} = useAuth()

    const { id } = useParams();

    const controller = new AbortController()


    useEffect(() => {
        const fetchUserProfile = () => {
            const { signal } = controller

            setFinishedLoading(false)
      
            fetch(USER_PROFILE_ROUTE+`/${id}`,{
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
    }, [id]);

    if(!finishedLoading) return <div className="flex flex-1 justify-center items-center">
        <LoadingSpinner big={true}/>
    </div>

    if(!userProfile) return <div>
        <h2 className="font-bold text-[3rem]">User Not Found</h2>
    </div>

    const subscribedTo = subscriptionUsers.findIndex((subscription) => subscription.userSubscribedToId == userProfile.id) !== -1

    const makeSubscription = async () => {
        const user: UserAuthor = {
            name: userProfile.name,
            username: userProfile.username,
            image: userProfile.image,
            id: userProfile.id
        }
        
        const wasSubscribed = subscribedTo
        
        setSendRequestAboutUnsubscribing(true)
        await subscribeToUser(subscribedTo, user)
        setSendRequestAboutUnsubscribing(false)
        
        const followersChange = wasSubscribed? -1: 1
        setUserProfile((userProfile) => {
            return {
              ...userProfile!,
              numberOfSubscriptions: userProfile!.numberOfSubscriptions + followersChange // Provide the new value for the 'name' property
            };
        });
    }

    return <div className="flex flex-col  mt-4 glass md:w-[80%] w-[100%] mx-[auto] justify-center">
        <div className="flex flex-col  justify-center">
            <div className="flex justify-center gap-2">
                <h2 className="text-2xl font-bold">Account information  </h2>
                <div className="flex"><ProfileImage src={userProfile.image}/></div>
            </div>
            <div className="text-center ">Name: {userProfile.username? userProfile.username: userProfile.name}</div>
            <div className="text-center">Created Account at: {formatDate(userProfile.createdAt)}</div>
            <div className="text-center">Number of reviews: {userProfile.numberOfReviews}</div>
            <div className="text-center">Number of subscribed users: {userProfile.numberOfSubscriptions}</div>
            <div className="text-center">Number of receipts: {userProfile.numberOfReceipts}</div>
            <div className="mt-3 flex gap-2 justify-end">
                {user?.id!==userProfile.id?
                    <>
                        {subscribedTo?
                            <Button disabled={sendRequestAboutUnsubscribing} onClick={()=>makeSubscription()} color="green">Unsubscribe</Button>
                        :
                            <Button disabled={sendRequestAboutUnsubscribing} onClick={()=>makeSubscription()} color="green">Subscribe</Button>    
                        }
                    </>
                :
                     null
                }

            </div>
            
        </div>  
        <div>
            <h2 className="text-2xl font-bold">Receipts: </h2>
            <UserReceipts/>
        </div> 
    </div>
}

export default UserProfile