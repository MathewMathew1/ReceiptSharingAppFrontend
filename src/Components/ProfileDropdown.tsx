import { useAuth } from "../Contexts/useAuth";

const ProfileDropdown = ({isOpen}:{isOpen: boolean}) => {
    const { logout}  = useAuth()

    return (
        <>
        {isOpen && (
            <div className="origin-top-right absolute z-20 right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-dark-primaryBg2
             ring-1 ring-black ring-opacity-5 focus:outline-none ">
                <div className="py-1">
                    <a
                        href="/user/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondaryBg dark:text-dark-text"
                    >
                        Profile
                    </a>
                    <a
                        href="/subscribed/receipts"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondaryBg dark:text-dark-text"
                    >
                        Your subscribed receipts
                    </a>
                    <a
                        href="/user/receipts"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondaryBg dark:text-dark-text"
                    >
                        Your receipts
                    </a>
                    <a
                        href="/user/feed"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondaryBg dark:text-dark-text"
                    >
                        Receipt Feed
                    </a>
                    <a
                        href="/new/receipt"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondaryBg dark:text-dark-text"
                    >
                        Create Receipt
                    </a>
                    <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondaryBg dark:text-dark-text"
                        onClick={()=>logout()}
                    >
                        Sign out
                    </a>
                </div>
            </div>
        )}
        </>
    );
};

export default ProfileDropdown;