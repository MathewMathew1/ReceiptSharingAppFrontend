import { Link } from "react-router-dom";
import { useAuth } from "../Contexts/useAuth";

const ProfileDropdown = ({isOpen}:{isOpen: boolean}) => {
    const { logout}  = useAuth()

    return (
        <>
        {isOpen && (
            <div className="origin-top-right absolute z-20 right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-dark-primaryBg2
             ring-1 ring-black ring-opacity-5 focus:outline-none ">
                <div className="py-1">
                    <Link
                        to="/user/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondaryBg dark:text-dark-text"
                    >
                        Profile
                    </Link>
                    <Link
                        to="/subscribed/receipts"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondaryBg dark:text-dark-text"
                    >
                        Your subscribed receipts
                    </Link>
                    <Link
                        to="/user/receipts"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondaryBg dark:text-dark-text"
                    >
                        Your receipts
                    </Link>
                    <Link
                        to="/user/feed"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondaryBg dark:text-dark-text"
                    >
                        Receipt Feed
                    </Link>
                    <Link
                        to="/new/receipt"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondaryBg dark:text-dark-text"
                    >
                        Create Receipt
                    </Link>
                    <Link
                        to="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondaryBg dark:text-dark-text"
                        onClick={()=>logout()}
                    >
                        Sign out
                    </Link>
                </div>
            </div>
        )}
        </>
    );
};

export default ProfileDropdown;