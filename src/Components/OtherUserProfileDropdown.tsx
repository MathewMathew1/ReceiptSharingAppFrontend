import { useState } from "react";
import { ProfileImage } from "./ProfileImage";
import { UserAuthor } from "../types/Receipt";
import { useAuth } from "../Contexts/useAuth";
import { Link } from "react-router-dom";


const POSITION = {
    left: "right-0",
    bot: "right-0",
    top: "right-0",
    right: "left-[30px] top-[-50%]",
}

const OtherUserProfileDropdown = ({user, position}:{user: UserAuthor, position: keyof typeof POSITION}) => {
    const [isOpen, setIsOpen] = useState(false)

    const auth = useAuth()

    const subscribedTo = auth.subscriptionUsers.find((subscription) => subscription.userSubscribedToId == user.id)

    return (
        <div onClick={()=>setIsOpen(!isOpen)} className="relative inline-block text-left">
            <ProfileImage src={user.image} size="medium"/>
    
        
            {isOpen && (
                <div className={`origin-top-right ${POSITION[position]} absolute z-20  mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-dark-primaryBg2
                ring-1 ring-black ring-opacity-5 focus:outline-none`}>
                    <div className="py-1">
                        {user.id !== auth.user?.id?
                            <>
                                {subscribedTo?
                                    <a
                                        onClick={()=>auth.subscribeToUser(true, user)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondaryBg dark:text-dark-text"
                                    >
                                        Unsubscribe
                                    </a>
                                :
                                    <a
                                        onClick={()=>auth.subscribeToUser(false, user)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondaryBg dark:text-dark-text"
                                    >
                                        Subscribe
                                    </a>
                                }
                            </>
                        :
                            null
                        }
                        <Link
                            to={`/profile/${user.id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondaryBg dark:text-dark-text"
                        >
                            Profile
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OtherUserProfileDropdown;