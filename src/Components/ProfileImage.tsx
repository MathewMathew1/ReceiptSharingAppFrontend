import { VscAccount } from "react-icons/vsc"

const SIZES = {
    small: "h-8 w-8",
    medium: "h-10 w-10",
    big: "h-12 w-12"
}

type ProfileImageProps = {
    src?: string|null
    className?: string
    size?: keyof typeof SIZES
}

export function ProfileImage({src, className="", size="medium"}: ProfileImageProps) {
    const sizeOfImageClass = SIZES[size]

    return <div className={`relative ${sizeOfImageClass} overflow-hidden rounded-full ${className}`}>
        {src==null? 
            <VscAccount className="h-full w-full"/> 
        : 
            <img referrerPolicy="no-referrer" src={src} alt="Profile Image" />
        }
    </div>
}