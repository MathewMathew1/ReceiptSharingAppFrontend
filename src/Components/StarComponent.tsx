import { useEffect, useState } from 'react';
import { BiSolidStar } from 'react-icons/bi';
import { useAuth } from '../Contexts/useAuth';

const StarRating = ({ rating, id }: {rating: number|undefined, id: number}) => {
    const [hoveredRating, setHoveredRating] = useState(rating? rating: 0);
    const [isBeingRated, setIsBeingRated] = useState(false)
    const {rateReceipt} = useAuth()

    const handleHover = (rating: number) => {
        setHoveredRating(rating);
    };

    const handleLeave = () => {
        if(rating){
            setHoveredRating(rating);
        }else{
            setHoveredRating(0);
        }
    };

    const handleRatingReceipts = async (rate: number) => {
        if(isBeingRated){
            return
        }
        setIsBeingRated(true)
        await rateReceipt(rate, id)
        setIsBeingRated(false)
    }

    useEffect(() => {
        setHoveredRating(rating? rating: 0)
    }, [rating]);

    return (
        <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((index) => (
            <BiSolidStar
                key={index}
                fill={(hoveredRating >= index) ? "yellow" : "gray"}
                onMouseEnter={() => handleHover(index)}
                onClick={()=>handleRatingReceipts(index)}
                onMouseLeave={handleLeave}
            />
        ))}
        </div>
    );
};

export default StarRating;